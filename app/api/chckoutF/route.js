import { NextResponse } from 'next/server';
import { CreateClient } from '@/lib/supabase/server';

export async function POST(request) {
    try {
        const body = await request.json();
        // mpData agora traz os dados do CardForm (token do cartão, parcelas, e dados do comprador)
        const { carrinho, paymentMethod, mpData, nomeCliente } = body;

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
        let totalGeralDoCarrinho = 0;
        const disbursements = [];

        for (const idTurmaString in pedidosPorTurma) {
            const pacote = pedidosPorTurma[idTurmaString];
            const idTurmaInt = parseInt(idTurmaString);
            
            // Acha a turma no banco que bate com a turma do carrinho
            const credencial = credenciaisTurmas.find(c => c.idturma === idTurmaInt);

            // Valida se a turma existe e se ela tem o idvendedor (Credencial MP) preenchido
            if (!credencial || !credencial.idvendedor) {
                return NextResponse.json({ error: `Turma ${idTurmaString} não possui configuração de recebimento válida.` }, { status: 400 });
            }

            totalGeralDoCarrinho += pacote.totalDaTurma;
            
            // Comissão de 10% da plataforma
            const minhaTaxa = pacote.totalDaTurma * 0.10; 

            disbursements.push({
                // AQUI ESTÁ A MÁGICA: O seu idvendedor é o collector_id do MP!
                collector_id: parseInt(credencial.idvendedor), 
                amount: Number(pacote.totalDaTurma.toFixed(2)), 
                application_fee: Number(minhaTaxa.toFixed(2)), 
                external_reference: `TURMA-${idTurmaString}`
            });
}

        // Determinar o tipo de pagamento correto para a API
        const paymentTypeId = paymentMethod === 'pix' ? 'bank_transfer' : 'credit_card';

        // Disparando a chamada unificada usando seu TOKEN MASTER
        const mpResponse = await fetch('https://api.mercadopago.com/v1/advanced_payments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.MERCADO_PAGO_MASTER_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                payer: {
                    email: user.email,

                },
                payments: [
                    {
                        payment_method_id: paymentMethod, // ex: 'visa', 'master', 'pix'
                        payment_type_id: paymentTypeId,
                        token: mpData?.token, // O token ÚNICO do cartão gerado pelo frontend
                        transaction_amount: totalGeralDoCarrinho,
                        installments: mpData?.installments || 1
                    }
                ],
                disbursements: disbursements
            })
        });

        const responseData = await mpResponse.json();

        if (!mpResponse.ok || responseData.errors) {
            console.error("Erro do Mercado Pago no Split Avançado:", responseData);
            return NextResponse.json({ 
                error: "Mercado Pago recusou a transação do split.", 
                detalhes: responseData.message || responseData.errors 
            }, { status: 400 });
        }

        // Identifica o status global do pagamento retornado pelo MP
        // No Advanced Payments, o status costuma vir dentro da transação principal
        const statusGlobalMP = responseData.status; // 'approved', 'pending', 'rejected'
        const statusVendaBanco = statusGlobalMP === 'approved' ? 'pago' : 'aguardando_pagamento';

        // === PASSO 7: SALVAR AS VENDAS NO BANCO (Dividido por loja, vinculadas ao mesmo ID do MP) ===
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
                    mp_payment_id: responseData.id.toString() // ID mestre do Advanced Payment para conciliação e Webhooks
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

            const { error: erroItens } = await supabase
                .from('venda_produto')
                .insert(itensParaInserir);

            if (erroItens) throw erroItens;
        }

        // Coleta dados adicionais caso seja PIX (Copia e Cola e QR Code)
        const primeiroPagamento = responseData.payments?.[0];
        const infoPix = primeiroPagamento?.point_of_interaction?.transaction_data;

        return NextResponse.json({ 
            success: true, 
            message: "Pedido e Split gerados com sucesso!",
            statusPagamento: statusGlobalMP,
            mpAdvancedId: responseData.id,
            pix: infoPix ? {
                qr_code: infoPix.qr_code,
                qr_code_base64: infoPix.qr_code_base64
            } : null
        }, { status: 200 });

    } catch (error) {
        console.error("Erro interno na API de checkout:", error);
        return NextResponse.json({ error: "Ocorreu um erro ao processar o pedido." }, { status: 500 });
    }
}