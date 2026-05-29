import { NextResponse } from 'next/server';
import { CreateClient } from '@/lib/supabase/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function POST(request) {
    try {
        const body = await request.json();

        // formData é o objeto padrão que o Checkout Bricks envia no onSubmit
        // recebemos também o carrinho vindo do seu contexto do front-end
        const { formData, carrinho } = body;

        if (!carrinho || carrinho.length === 0) {
            return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
        }

        if (!formData) {
            return NextResponse.json({ error: "Dados de pagamento ausentes." }, { status: 400 });
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

        // === TRAVA DE SEGURANÇA 3: VALIDAR ESTOQUE ===
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

        // === PASSO 4 & 5: COLETA DA TURMA E BUSCA DO ACCESS TOKEN DO OAUTH ===
        const idTurmaDoPedido = carrinho[0].produto.idturma;
        const totalGeralDoCarrinho = carrinho.reduce((acc, item) => acc + item.subtotal, 0);

        const { data: credencial, error: errCredencial } = await supabase
            .from('admin')
            .select('idturma, acess_token')
            .eq('idturma', idTurmaDoPedido)
            .single();

        if (errCredencial || !credencial || !credencial.acess_token) {
            return NextResponse.json({ error: "Esta loja não possui credencial válida vinculada." }, { status: 400 });
        }

        // === PASSO 6: INICIALIZAÇÃO DO SDK OFICIAL E MONTAGEM DO SPLIT COM BRICKS ===
        const client = new MercadoPagoConfig({
            accessToken: credencial.acess_token,
            options: { timeout: 5000 }
        });
        const payment = new Payment(client);

        const minhaTaxaPlataforma = totalGeralDoCarrinho * 0.10;

        const paymentBody = {
            transaction_amount: Number(totalGeralDoCarrinho.toFixed(2)),
            description: `Pedido unificado - App IFF (Loja ${idTurmaDoPedido})`,
            payment_method_id: formData.payment_method_id,
            installments: Number(formData.installments || 1),
            application_fee: Number(minhaTaxaPlataforma.toFixed(2)),
            external_reference: `IFF-${Date.now()}`,
            notification_url: "https://iffood.shop/api/webhook",
            payer: {
                email: formData.payer?.email || 'cliente.iffood@testuser.com',
                first_name: formData.payer?.first_name || "Cliente",
                last_name: formData.payer?.last_name || "IFF",
                identification: {
                    type: formData.payer?.identification?.type || "CPF",
                    number: formData.payer?.identification?.number
                        ? formData.payer.identification.number.replace(/\D/g, '')
                        : "00000000000"
                }
            }
        };

        if (formData.token) {
            paymentBody.token = formData.token;
        }

        console.log("[DEBUG] Enviando requisição oficial blindada através do SDK...");
        const responseData = await payment.create({ body: paymentBody });

        if (!responseData || responseData.status === 'rejected') {
            return NextResponse.json({
                error: "Mercado Pago recusou a transação.",
                detalhes: responseData.status_detail || "Verifique os dados informados."
            }, { status: 400 });
        }

        const statusGlobalMP = responseData.status;
        const statusVendaBanco = statusGlobalMP === 'approved' ? 'pago' : 'aguardando_pagamento';

        // === PASSO 7: SALVAR A VENDA ÚNICA NO BANCO ===
        const { data: novaVenda, error: erroVenda } = await supabase
            .from('venda')
            .insert([{
                status: statusVendaBanco,
                valor_total: totalGeralDoCarrinho,
                metodo_pagamento: formData.payment_method_id,
                idturma: idTurmaDoPedido,
                online: true,
                iduser: usuarioPerfil.id,
                mp_payment_id: responseData.id.toString()
            }])
            .select()
            .single();

        if (erroVenda) throw erroVenda;

        const itensParaInserir = carrinho.map(item => ({
            idvenda: novaVenda.idvenda,
            idproduto: item.produto.idproduto,
            quantidade: item.quantidade,
            observacao: item.observacao || null
        }));

        const { error: erroItens } = await supabase.from('venda_produto').insert(itensParaInserir);
        if (erroItens) throw erroItens;

        // === NOVO: ATUALIZAR ESTOQUE DOS PRODUTOS VENDIDOS ===
        // Mudado de pacote.itens para ler diretamente do 'carrinho' recebido no body
        for (const item of carrinho) {
            const prodBanco = produtosNoBanco.find(p => String(p.idproduto) === String(item.produto.idproduto));

            if (prodBanco) {
                const novoEstoque = prodBanco.estoque - item.quantidade;

                const { error: erroEstoque } = await supabase
                    .from('produtos')
                    .update({ estoque: novoEstoque })
                    .eq('idproduto', prodBanco.idproduto);

                if (erroEstoque) throw erroEstoque;
            }
        }

        // === NOVO: ENVIO PARA O SERVIDOR DE WHATSAPP ===
        const promessasEnvioWhats = []; // Declarando o array que faltava
        
        // Verifica se veio o telefone da autenticação do Supabase
        const telefoneDoUsuario = user.user_metadata?.phone || user.phone;

        if (telefoneDoUsuario) {
            const mensagemFormatada = `*IFFOOD Informa!* \n\nO seu pedido *#${novaVenda.idvenda}* foi solicitado para as turmas. Fique atento ao aplicativo para acompanhar o andamento!`;

            const payloadWhatsApp = {
                to: telefoneDoUsuario,
                type: 'text',
                text: mensagemFormatada
            };

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
                    console.error(`[WhatsApp] API recusou o envio para ${telefoneDoUsuario}. Status: ${res.status}`);
                } else {
                    console.log(`[WhatsApp] Mensagem enviada com sucesso para ${telefoneDoUsuario}`);
                }
            })
            .catch(err => {
                clearTimeout(timeoutId);
                if (err.name === 'AbortError') {
                    console.error(`[WhatsApp Timeout] Conexão com o gateway demorou mais de 2s e foi cortada.`);
                } else {
                    console.error(`[WhatsApp Error] Falha de rede interna:`, err.message);
                }
            });

            promessasEnvioWhats.push(disparo);
        }

        // Se quiser esperar o WhatsApp antes de responder o front (opcional, mas evita travar o cliente se demorar)
        // await Promise.all(promessasEnvioWhats);

        // === PASSO 8: RETORNO UNIFICADO PARA O FRONT-END (AGORA NO LUGAR CERTO) ===
        const respostaFinal = {
            success: true,
            paymentMethod: formData.payment_method_id === 'pix' ? 'pix' : 'card',
            pedidoId: responseData.id.toString(),
            total: totalGeralDoCarrinho
        };

        if (formData.payment_method_id === 'pix') {
            const infoPix = responseData.point_of_interaction?.transaction_data;
            respostaFinal.qrCode = infoPix?.qr_code;
            respostaFinal.qrCodeBase64 = infoPix?.qr_code_base64;
        }

        return NextResponse.json(respostaFinal);
        
    } catch (error) {
        console.error("Erro interno na API de checkout:", error);
        const mensagemErroMP = error.cause?.[0]?.description || error.message || "Erro ao processar pedido.";
        return NextResponse.json({ error: mensajeErroMP }, { status: 500 });
    }
}