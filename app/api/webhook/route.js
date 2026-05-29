import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function POST(request) {
    try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json({ error: "FALTA VARIÁVEL DE AMBIENTE" }, { status: 500 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        // 1. Tenta ler o corpo (JSON) de forma segura
        let body = {};
        try {
            body = await request.json();
        } catch (e) {
            console.log("Corpo da requisição não é JSON ou está vazio.");
        }

        // 2. Tenta ler os parâmetros da URL (Query Params)
        const url = new URL(request.url);
        const idFromQuery = url.searchParams.get('data.id') || url.searchParams.get('id');

        // 3. Verifica se o evento é de pagamento (via body ou query)
        const type = body.type || url.searchParams.get('type') || url.searchParams.get('topic');
        const action = body.action || '';

        if (type !== 'payment' && !action.includes('payment')) {
            return NextResponse.json({ message: "Ignorado - Não é notificação de pagamento" }, { status: 200 });
        }

        // 4. O "Cata-Tudo": Procura o ID no body ou na URL
        const paymentId = body.data?.id || body.resource?.split('/').pop() || idFromQuery;

        // Se MESMO ASSIM não achar o ID, ele mostra exatamente o que o MP mandou
        if (!paymentId) {
            return NextResponse.json({ 
                error: "ID não encontrado em nenhum lugar", 
                bodyQueO_MP_Mandou: body, 
                urlQueO_MP_Mandou: url.searchParams.toString() 
            }, { status: 400 });
        }

        // 5. Daqui pra baixo é igual: Busca a venda
        const { data: venda, error: erroVenda } = await supabaseAdmin
            .from('venda')
            .select('idturma, status')
            .eq('mp_payment_id', paymentId.toString())
            .maybeSingle();

        if (erroVenda) {
            return NextResponse.json({ error: "Erro ao buscar venda no Supabase", detalhe: erroVenda }, { status: 500 });
        }

        if (!venda) {
            return NextResponse.json({ message: "Venda não encontrada no banco", idProcurado: paymentId }, { status: 200 });
        }

        if (venda.status === 'pago') {
            return NextResponse.json({ message: "Já estava pago" }, { status: 200 });
        }

        const { data: credencial, error: errCredencial } = await supabaseAdmin
            .from('admin')
            .select('acess_token')
            .eq('idturma', venda.idturma)
            .single();

        if (errCredencial || !credencial || !credencial.acess_token) {
            return NextResponse.json({ error: "Credencial não encontrada", detalhe: errCredencial }, { status: 500 });
        }

        try {
            const client = new MercadoPagoConfig({ accessToken: credencial.acess_token });
            const payment = new Payment(client);
            const paymentData = await payment.get({ id: paymentId });

            if (paymentData.status === 'approved') {
                const { error: dbError } = await supabaseAdmin
                    .from('venda')
                    .update({ status: 'pago' })
                    .eq('mp_payment_id', paymentId.toString()); 

                if (dbError) {
                    return NextResponse.json({ error: "Erro ao atualizar venda", detalhe: dbError }, { status: 500 });
                }
            }

            return NextResponse.json({ success: true, status_mp: paymentData.status }, { status: 200 });
            
        } catch (mpError) {
            return NextResponse.json({ error: "Erro no SDK do Mercado Pago", detalhe: mpError.message }, { status: 500 });
        }

        // === PASSO 6: INICIALIZAÇÃO DO SDK OFICIAL E MONTAGEM DO SPLIT COM BRICKS ===
        const client = new MercadoPagoConfig({
            accessToken: credencial.acess_token,
            options: { timeout: 5000 }
        });
        const payment = new Payment(client);

        const minhaTaxaPlataforma = totalGeralDoCarrinho * 0.10;

        // Uso do Optional Chaining (?.) para evitar que propriedades ausentes quebrem o código
        const paymentBody = {
            transaction_amount: Number(totalGeralDoCarrinho.toFixed(2)),
            description: `Pedido unificado - App IFF (Loja ${idTurmaDoPedido})`,
            payment_method_id: formData.payment_method_id,
            installments: Number(formData.installments || 1),
            application_fee: Number(minhaTaxaPlataforma.toFixed(2)),
            external_reference: `IFF-${Date.now()}`,
            notification_url: "https://iffood.shop/api/webhook",
            payer: {
                // Fallbacks seguros caso o Brick omita algum dado no Pix
                email: formData.payer?.email || 'cliente.iffood@testuser.com',
                first_name: formData.payer?.first_name || "Cliente",
                last_name: formData.payer?.last_name || "IFF",
                identification: {
                    type: formData.payer?.identification?.type || "CPF",
                    number: formData.payer?.identification?.number
                        ? formData.payer.identification.number.replace(/\D/g, '')
                        : "00000000000" // CPF padrão de teste caso venha vazio
                }
                
            }
        };

        // Injeta o token de criptografia do cartão APENAS se ele existir de verdade
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

        // === PASSO 8: RETORNO UNIFICADO PARA O FRONT-END ===
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

    } catch (error) {
        return NextResponse.json({ error: "Erro CRÍTICO no Catch Geral", detalhe: error.message }, { status: 500 });
    }
}