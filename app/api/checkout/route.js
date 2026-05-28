import { NextResponse } from 'next/server';
import { CreateClient } from '@/lib/supabase/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { carrinho, paymentMethod } = body;

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

        // === PASSO 4: SPLIT DE PEDIDOS POR TURMA ===
        const pedidosPorTurma = carrinho.reduce((acc, item) => {
            const idTurma = item.produto.idturma;
            if (!acc[idTurma]) {
                acc[idTurma] = { totalDaTurma: 0, itens: [] };
            }
            acc[idTurma].itens.push(item);
            acc[idTurma].totalDaTurma += item.subtotal;
            return acc;
        }, {});

        // === PASSO 5: SALVAR NO BANCO COM STATUS 'aguardando_pagamento' ===
        // O estoque NÃO é alterado aqui!
        for (const idTurmaString in pedidosPorTurma) {
            const pacote = pedidosPorTurma[idTurmaString];

            const { data: novaVenda, error: erroVenda } = await supabase
                .from('venda')
                .insert([{
                    status: 'aguardando_pagamento', // Entra como pendente
                    valor_total: pacote.totalDaTurma,
                    metodo_pagamento: paymentMethod,
                    idturma: parseInt(idTurmaString),
                    online: true,
                    iduser: usuarioPerfil.id
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

        return NextResponse.json({ success: true, message: "Pedido gerado com sucesso! Aguardando pagamento." }, { status: 200 });

    } catch (error) {
        console.error("Erro interno na API de checkout:", error);
        return NextResponse.json({ error: "Ocorreu um erro ao processar o pedido." }, { status: 500 });
    }
}