import { NextResponse } from 'next/server';
import { CreateClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

// Inicializa a Stripe com a sua chave secreta (USE A CHAVE DE TESTE POR ENQUANTO)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

export async function POST(request) {
    try {
        const body = await request.json();
        const { carrinho, paymentMethod } = body;
        const supabase = await CreateClient();

         // === TRAVA DE SEGURANÇA 1: VERIFICA SE O USUÁRIO ESTÁ REALMENTE LOGADO NO SERVIDOR ===
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Sessão expirada ou usuário não autenticado." }, { status: 401 });
        }

        // =========================================================================
        // === PASSO 2: BUSCAR O ID INTERNO DA TABELA 'usuarios' ===
        // =========================================================================
        const { data: usuarioPerfil, error: erroPerfil } = await supabase
            .from('usuarios')
            .select('id') // Queremos pegar a coluna 'id' (PK)
            .eq('user_id', user.id) // Onde a coluna 'user_id' seja igual ao auth do Supabase
            .single();

        // Se der erro ou não achar o usuário, barramos a venda pois falta o perfil
        if (erroPerfil || !usuarioPerfil) {
            console.error("Erro ao buscar o ID interno do usuário:", erroPerfil);
            return NextResponse.json({ error: "Perfil de usuário não encontrado. Por favor, complete seu cadastro." }, { status: 400 });
        }
        // =========================================================================

        // === TRAVA DE SEGURANÇA 3: VALIDAR ESTOQUE ===
        const idsProdutos = carrinho.map(item => item.produto.idproduto);

        const { data: produtosNoBanco, error: errEstoque } = await supabase
            .from('produtos')
            .select('idproduto, estoque, nome')
            .in('idproduto', idsProdutos);

        if (errEstoque || !produtosNoBanco) {
            return NextResponse.json({ error: "Erro ao validar o estoque dos produtos." }, { status: 500 });
        }

        const quantidadesPedidas = carrinho.reduce((acc, item) => {
            acc[item.produto.idproduto] = (acc[item.produto.idproduto] || 0) + item.quantidade;
            return acc;
        }, {});

        for (const prodBanco of produtosNoBanco) {
            const qtdPedida = quantidadesPedidas[prodBanco.idproduto];
            if (qtdPedida > prodBanco.estoque) {
                return NextResponse.json({
                    error: `Ops! O produto '${prodBanco.nome}' acabou de ter o estoque esgotado ou reduzido. Estoque disponível: ${prodBanco.estoque}.`
                }, { status: 400 });
            }
        }

        // === PASSO 4: REALIZAR O SPLIT DE PEDIDOS POR TURMA ===
        const pedidosPorTurma = carrinho.reduce((acc, item) => {
            const idTurma = item.produto.idturma;
            if (!acc[idTurma]) {
                acc[idTurma] = { totalDaTurma: 0, itens: [] };
            }
            acc[idTurma].itens.push(item);
            acc[idTurma].totalDaTurma += item.subtotal;
            return acc;
        }, {});

        const vendasGeradasIds = [];

        // === PASSO 5: SALVAR NO BANCO (COMO PENDENTE) ===
        for (const idTurmaString in pedidosPorTurma) {
            const pacote = pedidosPorTurma[idTurmaString];

            // A: Cria a venda injetando o ID correto! STATUS DEVE SER PENDENTE!
            const { data: novaVenda, error: erroVenda } = await supabase
                .from('venda')
                .insert([{
                    status: 'aguardando_pagamento', // <--- Mudamos de pago para pendente
                    valor_total: pacote.totalDaTurma,
                    metodo_pagamento: paymentMethod, // Guardando a intenção de pagamento
                    idturma: parseInt(idTurmaString),
                    online: true,
                    iduser: usuarioPerfil.id 
                }])
                .select()
                .single();

            if (erroVenda) throw erroVenda;
            vendasGeradasIds.push(novaVenda.idvenda);

            // B: Prepara os produtos para a tabela venda_produto
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

        let totalGeralEmCentavos = 0; // Você precisa calcular o total de todo o carrinho e multiplicar por 100

        // Cria a Intenção de Pagamento na Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalGeralEmCentavos, // Ex: R$ 50,00 = 5000
            currency: 'brl',
            // Define o tipo de pagamento baseado na escolha do usuário
            payment_method_types: paymentMethod === 'pix' ? ['pix'] : ['card'],
            metadata: {
                vendas_ids: vendasGeradasIds.join(','),
            },
        });

        // Devolvemos o client_secret pro frontend conseguir cobrar o cartão ou gerar o Pix
        return NextResponse.json({ 
            success: true, 
            clientSecret: paymentIntent.client_secret 
        }, { status: 200 });

    } catch (error) {
        console.error("Erro no checkout:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}