import { NextResponse } from 'next/server';
import { CreateClient } from '@/lib/supabase/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { carrinho } = body;

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

        const promessasEnvioWhats = [];

        // === PASSO 5: SALVAR NO BANCO E PREPARAR NOTIFICAÇÃO ===
        for (const idTurmaString in pedidosPorTurma) {
            const pacote = pedidosPorTurma[idTurmaString];

            // 1. Cria o registro da venda principal
            const { data: novaVenda, error: erroVenda } = await supabase
                .from('venda')
                .insert([{
                    status: 'aguardando_pagamento',
                    valor_total: pacote.totalDaTurma,
                    idturma: parseInt(idTurmaString),
                    online: true,
                    iduser: usuarioPerfil.id
                }])
                .select()
                .single();

            if (erroVenda) throw erroVenda;

            // 2. Cria os registros dos produtos vinculados à venda
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

            // OBS: A baixa de estoque via banco de dados foi removida daqui, conforme solicitado.

            // 3. ENVIO PARA O SERVIDOR DE WHATSAPP
            if (user.phone) {
                // Remove o "+" do número vindo do banco, caso exista
                const formatado = user.phone.replace("+", "");

                // Mensagem atualizada dizendo que foi aprovado com sucesso
                const mensagemFormatada = `*IFFOOD Informa!* \n\nO seu pedido *#${novaVenda.idvenda}* foi aprovado com sucesso! Fique atento ao aplicativo para acompanhar o andamento!`;

                const payloadWhatsApp = {
                    to: formatado,
                    type: 'text',
                    text: mensagemFormatada
                };

                // Mantida a trava de timeout de 2 segundos para não prender o checkout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000);

                const disparo = fetch('http://164.163.33.150:8001/api/v1/sessions/3c993713-6d8e-4fab-9bea-491e9af3ed92/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': process.env.WHATSAPP_API_KEY
                    },
                    body: JSON.stringify(payloadWhatsApp),
                    signal: controller.signal
                })
                    .then((res) => {
                        clearTimeout(timeoutId);
                        if (!res.ok) {
                            console.error(`[WhatsApp] API recusou o envio para ${formatado}. Status: ${res.status}`);
                        } else {
                            console.log(`[WhatsApp] Mensagem enviada com sucesso para ${formatado}`);
                        }
                    })
                    .catch(err => {
                        clearTimeout(timeoutId);
                        if (err.name === 'AbortError') {
                            console.error(`[WhatsApp Timeout] Conexão com o gateway demorou mais de 2s e foi cortada para proteger o Checkout.`);
                        } else {
                            console.error(`[WhatsApp Error] Falha de rede interna:`, err.message);
                        }
                    });

                promessasEnvioWhats.push(disparo);
            }
        }

        await Promise.allSettled(promessasEnvioWhats);

        // Atualizada a resposta de sucesso para não citar mais o estoque
        return NextResponse.json({ success: true, message: "Pedido gerado com sucesso!" }, { status: 200 });

    } catch (error) {
        console.error("Erro interno na API de checkout:", error);
        return NextResponse.json({ error: "Ocorreu um erro ao processar o pedido." }, { status: 500 });
    }
}