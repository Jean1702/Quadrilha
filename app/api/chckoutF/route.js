import { NextResponse } from 'next/server';
import { CreateClient } from '@/lib/supabase/server';

export async function POST(request) {
    try {
        const body = await request.json();
        // mpData agora traz os dados do CardForm (token do cartão, parcelas, e dados do comprador)
        const { carrinho, paymentMethod, mpData, nomeCliente, CPF, email} = body;

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

        // === PASSO 4: AGRUPAR PEDIDOS POR TURMA PARA CALCULAR O SPLIT ===
        const pedidosPorTurma = carrinho.reduce((acc, item) => {
            const idTurma = item.produto.idturma;
            if (!acc[idTurma]) {
                acc[idTurma] = { totalDaTurma: 0, itens: [] };
            }
            acc[idTurma].itens.push(item);
            acc[idTurma].totalDaTurma += item.subtotal;
            return acc;
        }, {});

        // === PASSO 5: BUSCAR OS COLECTOR_IDS (IDs do MP) DE CADA TURMA ===
        // Ajuste o nome da tabela 'turma_mp' e da coluna 'mp_collector_id' conforme o seu banco
        // Busca apenas a turma e a credencial do MP (que você chamou de idvendedor)
        const { data: credenciaisTurmas, error: errCred } = await supabase
            .from('admin')
            .select('idturma, idvendedor') 
            .in('idturma', idsTurmasEnvolvidas);

        if (errCred || !credenciaisTurmas || credenciaisTurmas.length !== idsTurmasEnvolvidas.length) {
            console.error("Erro na busca de credenciais:", errCred, credenciaisTurmas);
            return NextResponse.json({ error: "Erro ao mapear credenciais de pagamento das turmas envolvidas." }, { status: 500 });
        }

        // === PASSO 6: MONTAR A REQUISIÇÃO DO SPLIT AVANÇADO DO MERCADO PAGO ===
       // === PASSO 6: MONTAR A REQUISIÇÃO DO SPLIT AVANÇADO ===
        let totalGeralDoCarrinho = 0;
        const disbursements = [];
        const externalRef = `IFF-${Date.now()}`;

        for (const idTurmaString in pedidosPorTurma) {
            const pacote = pedidosPorTurma[idTurmaString];
            const idTurmaInt = parseInt(idTurmaString);

            const credencial = credenciaisTurmas.find(c => c.idturma === idTurmaInt);
            if (!credencial || !credencial.idvendedor) {
                return NextResponse.json({ error: `Turma ${idTurmaString} não possui configuração válida.` }, { status: 400 });
            }

            totalGeralDoCarrinho += pacote.totalDaTurma;
            const minhaTaxa = pacote.totalDaTurma * 0.10; 

            disbursements.push({
                collector_id: parseInt(credencial.idvendedor), 
                amount: Number(pacote.totalDaTurma.toFixed(2)), 
                application_fee: Number(minhaTaxa.toFixed(2)), 
                external_reference: `TURMA-${idTurmaString}`
            });
        }

        const paymentTypeId = paymentMethod === 'pix' ? 'bank_transfer' : 'credit_card';

        // 1. Monta o pagamento limpo (evita mandar token vazio se for Pix)
        const paymentItem = {
            payment_method_id: paymentMethod,
            payment_type_id: paymentTypeId,
            transaction_amount: Number(totalGeralDoCarrinho.toFixed(2))
        };

        if (paymentMethod !== 'pix') {
            paymentItem.token = mpData?.token;
            paymentItem.installments = Number(mpData?.installments || 1);
        }

        // 2. Garante o CPF do comprador (Crucial pro MP não dar erro 400)
        const payerCPF = CPF.replace(/\D/g, '') || "00000000000";

        const mpPayload = {
            payer: {
                email: 'jean.carlos.ac1@gmail.com',
                identification: {
                    type: "CPF",
                    number: payerCPF
                }
            },
            payments: [paymentItem],
            disbursements: disbursements,
            external_reference: externalRef
        };
        console.log(mpPayload)

        // Disparando a chamada
        const mpResponse = await fetch('https://api.mercadopago.com/v1/advanced_payments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.MERCADO_PAGO_MASTER_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mpPayload)
        });

        const responseData = await mpResponse.json();

        if (!mpResponse.ok || responseData.errors || responseData.status === 'rejected') {
            console.error("Erro no MP:", responseData);
            return NextResponse.json({ 
                error: "Mercado Pago recusou a transação do split.", 
                detalhes: responseData.message || "Verifique os dados informados." 
            }, { status: 400 });
        }

        const statusGlobalMP = responseData.status; 
        const statusVendaBanco = statusGlobalMP === 'approved' ? 'pago' : 'aguardando_pagamento';

        // === PASSO 7: SALVAR AS VENDAS NO BANCO ===
        for (const idTurmaString in pedidosPorTurma) {
            const pacote = pedidosPorTurma[idTurmaString];

            const { data: novaVenda, error: erroVenda } = await supabase
                .from('venda')
                .insert([{
                    status: statusVendaBanco,
                    valor_total: pacote.totalDaTurma,
                    metodo_pagamento: paymentMethod,
                    idturma: parseInt(idTurmaString),
                    online: true,
                    iduser: usuarioPerfil.id,
                    mp_payment_id: responseData.id.toString() 
                }])
                .select()
                .single();

            if (erroVenda) throw erroVenda;

            const itensParaInserir = pacote.itens.map(item => ({
                idvenda: novaVenda.idvenda,
                idproduto: item.produto.idproduto,
                quantidade: item.quantidade,
                observacao: item.observacao || null
            }));

            const { error: erroItens } = await supabase.from('venda_produto').insert(itensParaInserir);
            if (erroItens) throw erroItens;
        }

        // === PASSO 8: RETORNO PARA O FRONT-END ===
        // Aqui está a resposta exata que a sua tela de Pix precisa para funcionar perfeitamente:
        if (paymentMethod === 'pix') {
            const infoPix = responseData.payments?.[0]?.point_of_interaction?.transaction_data;
            
            return NextResponse.json({
                success: true,
                paymentMethod: 'pix',
                pedidoId: responseData.id.toString(), // ID que o front usa para escutar o supabase
                qrCode: infoPix?.qr_code,             // Link Copia e Cola
                qrCodeBase64: infoPix?.qr_code_base64, // Imagem
                total: totalGeralDoCarrinho           // Total passado como parâmetro como você pediu!
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
        return NextResponse.json({ error: "Ocorreu um erro ao processar o pedido." }, { status: 500 });
    }
}