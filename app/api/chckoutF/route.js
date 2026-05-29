import { NextResponse } from 'next/server';
import { CreateClient } from '@/lib/supabase/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function POST(request) {
    try {
        const body = await request.json();
        const { carrinho, paymentMethod, mpData, nomeCliente, CPF, email } = body;

        if (!carrinho || carrinho.length === 0) {
            return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
        }

        const supabase = await CreateClient();

        // === TRAVA DE SEGURANÇA 1: USUÁRIO LOGADO ===
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Sessão expirada ou usuário não autenticado." }, { status: 401 });
        }

        // === PASSO 2: BUSCAR O ID INTERNO DO USUÁRIO ===
        const { data: usuarioPerfil, error: erroPerfil } = await supabase
            .from('usuarios')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (erroPerfil || !usuarioPerfil) {
            return NextResponse.json({ error: "Perfil de usuário não encontrado." }, { status: 400 });
        }

        // === TRAVA DE SEGURANÇA 3: VALIDAR SE HÁ ESTOQUE DISPONÍVEL AGORA ===
        const idsProdutos = carrinho.map(item => item.produto.idproduto);

        const { data: produtosNoBanco, error: errEstoque } = await supabase
            .from('produtos')
            .select('idproduto, estoque, nome, isActivy, idturma')
            .in('idproduto', idsProdutos);

        if (errEstoque || !produtosNoBanco) {
            return NextResponse.json({ error: "Erro ao validar os produtos no banco." }, { status: 500 });
        }

        const idsTurmasEnvolvidas = [...new Set(produtosNoBanco.map(p => p.idturma))];
        const { data: turmasNoBanco, error: errTurmas } = await supabase
            .from('turma')
            .select('idturma, is_active')
            .in('idturma', idsTurmasEnvolvidas);

        if (errTurmas || !turmasNoBanco) {
            return NextResponse.json({ error: "Erro ao validar o status das lojas." }, { status: 500 });
        }

        const quantidadesPedidas = carrinho.reduce((acc, item) => {
            acc[item.produto.idproduto] = (acc[item.produto.idproduto] || 0) + item.quantidade;
            return acc;
        }, {});

        for (const prodBanco of produtosNoBanco) {
            const qtdPedida = quantidadesPedidas[prodBanco.idproduto];
            const turmaDoProduto = turmasNoBanco.find(t => t.idturma === prodBanco.idturma);

            if (prodBanco.isActivy === false) {
                return NextResponse.json({ error: `O produto '${prodBanco.nome}' não está mais disponível.` }, { status: 400 });
            }

            if (turmaDoProduto && turmaDoProduto.is_active === false) {
                return NextResponse.json({ error: "Uma das lojas fechou antes da conclusão do pedido." }, { status: 400 });
            }

            if (qtdPedida > prodBanco.estoque) {
                return NextResponse.json({
                    error: `Ops! O produto '${prodBanco.nome}' não tem estoque suficiente. Disponível: ${prodBanco.estoque}.`
                }, { status: 400 });
            }
        }

        // =================================================================
        // === PASSO 4 & 5: COLETA DA TURMA E BUSCA DO ACCESS TOKEN ===
        // =================================================================
        const idTurmaDoPedido = carrinho[0].produto.idturma;
        const totalGeralDoCarrinho = carrinho.reduce((acc, item) => acc + item.subtotal, 0);

        console.log(`[DEBUG] Processando via SDK Oficial para a Turma: ${idTurmaDoPedido}. Total: R$ ${totalGeralDoCarrinho}`);

        const { data: credencial, error: errCredencial } = await supabase
            .from('admin')
            .select('idturma, acess_token') 
            .eq('idturma', idTurmaDoPedido)
            .single();

        if (errCredencial || !credencial || !credencial.acess_token) {
            console.error("Erro na busca de credencial da turma:", errCredencial);
            return NextResponse.json({ error: "Esta loja/turma não possui uma credencial de acesso válida vinculada via OAuth." }, { status: 400 });
        }

        // =================================================================
        // === PASSO 6: INICIALIZAÇÃO DO SDK OFICIAL E SPLIT DE TAXA ===
        // =================================================================
        const client = new MercadoPagoConfig({ 
            accessToken: credencial.acess_token, 
            options: { timeout: 5000 } 
        });
        const payment = new Payment(client);

        const minhaTaxaPlataforma = totalGeralDoCarrinho * 0.10; 
        const payerCPF = CPF.replace(/\D/g, '') || "00000000000";

        // Montagem correta do corpo (Sem a propriedade token nativa)
        const paymentBody = {
            transaction_amount: Number(totalGeralDoCarrinho.toFixed(2)),
            description: `Pedido unificado - App IFF (Loja ${idTurmaDoPedido})`,
            payment_method_id: paymentMethod,
            payment_type_id: paymentMethod === 'pix' ? 'bank_transfer' : 'credit_card',
            installments: paymentMethod === 'pix' ? 1 : Number(mpData?.installments || 1),
            application_fee: Number(minhaTaxaPlataforma.toFixed(2)), 
            external_reference: `IFF-${Date.now()}`,
            
            payer: {
                email: email || 'jean.carlos.ac1@gmail.com',
                identification: {
                    type: "CPF",
                    number: payerCPF
                }
            }
        };

        // Injeta o token de forma limpa apenas se NÃO for Pix e o token existir
        if (paymentMethod !== 'pix' && mpData?.token) {
            paymentBody.token = mpData.token;
        }

        console.log("[DEBUG] Enviando requisição oficial através do SDK...");

        const responseData = await payment.create({ body: paymentBody });

        if (!responseData || responseData.status === 'rejected') {
            console.error("Erro ou rejeição no MP:", responseData);
            return NextResponse.json({
                error: "Mercado Pago recusou a transação.",
                detalhes: responseData.status_detail || "Verifique as credenciais ou os dados informados."
            }, { status: 400 });
        }

        const statusGlobalMP = responseData.status;
        const statusVendaBanco = statusGlobalMP === 'approved' ? 'pago' : 'aguardando_pagamento';

        // =================================================================
        // === PASSO 7: SALVAR A VENDA ÚNICA NO BANCO ===
        // =================================================================
        
        // ⚠️ Nota: Certifique-se se o nome correto da sua coluna no banco é 
        // 'mp_payment_id' ou 'idvenda' para bater com o que seu webhook e front buscam.
        const { data: novaVenda, error: erroVenda } = await supabase
            .from('venda')
            .insert([{
                status: statusVendaBanco,
                valor_total: totalGeralDoCarrinho,
                metodo_pagamento: paymentMethod,
                idturma: idTurmaDoPedido,
                online: true,
                iduser: usuarioPerfil.id,
                mp_payment_id: responseData.id.toString() 
            }])
            .select()
            .single();

        if (erroVenda) {
            console.error("Erro ao salvar venda master:", erroVenda);
            throw erroVenda;
        }

        const itensParaInserir = carrinho.map(item => ({
            idvenda: novaVenda.idvenda, // chave estrangeira que liga ao id real da tabela venda
            idproduto: item.produto.idproduto,
            quantidade: item.quantidade,
            observacao: item.observacao || null
        }));

        const { error: erroItens } = await supabase.from('venda_produto').insert(itensParaInserir);
        if (erroItens) {
            console.error("Erro ao salvar subitens da venda:", erroItens);
            throw erroItens;
        }

        // === PASSO 8: RETORNO PARA O FRONT-END ===
        if (paymentMethod === 'pix') {
            const infoPix = responseData.point_of_interaction?.transaction_data;

            return NextResponse.json({
                success: true,
                paymentMethod: 'pix',
                pedidoId: responseData.id.toString(),
                qrCode: infoPix?.qr_code,
                qrCodeBase64: infoPix?.qr_code_base64,
                total: totalGeralDoCarrinho
            });
        }

        return NextResponse.json({
            success: true,
            paymentMethod: 'card',
            pedidoId: responseData.id.toString(),
            status: statusGlobalMP
        });

    } catch (error) {
        console.error("Erro interno na API de checkout:", error);
        const mensagemErroMP = error.cause?.[0]?.description || error.message || "Ocorreu um erro ao processar o pedido.";
        return NextResponse.json({ error: mensagemErroMP }, { status: 500 });
    }
}