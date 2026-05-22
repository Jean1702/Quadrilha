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

        // === TRAVA DE SEGURANÇA 1: VERIFICA SE O USUÁRIO ESTÁ REALMENTE LOGADO NO SERVIDOR ===
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Sessão expirada ou usuário não autenticado." }, { status: 401 });
        }

        // === TRAVA DE SEGURANÇA 2: VALIDAR SE HÁ ESTOQUE NO BANCO DE DADOS ANTES DE PROSSEGUIR ===
        // Pegamos todos os IDs de produtos do carrinho para fazer uma única busca no banco
        const idsProdutos = carrinho.map(item => item.produto.idproduto);

        const { data: produtosNoBanco, error: errEstoque } = await supabase
            .from('produtos')
            .select('idproduto, estoque, nome')
            .in('idproduto', idsProdutos);

        if (errEstoque || !produtosNoBanco) {
            return NextResponse.json({ error: "Erro ao validar o estoque dos produtos." }, { status: 500 });
        }

        // Agrupamos os produtos do carrinho por idproduto para somar as quantidades (caso o mesmo item tenha obs diferentes)
        const quantidadesPedidas = carrinho.reduce((acc, item) => {
            acc[item.produto.idproduto] = (acc[item.produto.idproduto] || 0) + item.quantidade;
            return acc;
        }, {});

        // Comparamos o pedido do cliente com o estoque real do banco de dados naquele exato milissegundo
        for (const prodBanco of produtosNoBanco) {
            const qtdPedida = quantidadesPedidas[prodBanco.idproduto];
            if (qtdPedida > prodBanco.estoque) {
                return NextResponse.json({
                    error: `Ops! O produto '${prodBanco.nome}' acabou de ter o estoque esgotado ou reduzido. Estoque disponível: ${prodBanco.estoque}.`
                }, { status: 400 });
            }
        }

        // === PASSO 3: REALIZAR O SPLIT DE PEDIDOS POR TURMA ===
        const pedidosPorTurma = carrinho.reduce((acc, item) => {
            const idTurma = item.produto.idturma;
            if (!acc[idTurma]) {
                acc[idTurma] = { totalDaTurma: 0, itens: [] };
            }
            acc[idTurma].itens.push(item);
            acc[idTurma].totalDaTurma += item.subtotal;
            return acc;
        }, {});

        // === PASSO 4: SALVAR NO BANCO (SEM SUBTRAIR ESTOQUE) ===
        for (const idTurmaString in pedidosPorTurma) {
            const pacote = pedidosPorTurma[idTurmaString];

            // A: Cria a venda ASSOCIADA ao iduser do usuário logado!
            const { data: novaVenda, error: erroVenda } = await supabase
                .from('venda')
                .insert([{
                    status: 'aguardando_pagamento',
                    valor_total: pacote.totalDaTurma,
                    metodo_pagamento: paymentMethod,
                    idturma: parseInt(idTurmaString),
                    online: true,
                    iduser: user.id // <--- INJETANDO O ID DO USUÁRIO AUTENTICADO AQUI
                }])
                .select()
                .single();

            if (erroVenda) throw erroVenda;

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

            // C: Removido temporariamente para testes
        }

        return NextResponse.json({ success: true, message: "Pedido gerado com sucesso!" }, { status: 200 });

    } catch (error) {
        console.error("Erro interno na API de checkout:", error);
        return NextResponse.json({ error: "Ocorreu um erro ao processar o pedido." }, { status: 500 });
    }
}