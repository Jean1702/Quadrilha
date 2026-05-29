import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function POST(request) {
    try {
        // === 1. BLINDAGEM DE VARIÁVEIS DE AMBIENTE ===
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error("[WEBHOOK] Erro: Faltam variáveis de ambiente no servidor.");
            return NextResponse.json({ error: "FALTA VARIÁVEL DE AMBIENTE SUPABASE" }, { status: 500 });
        }

        // === 2. CRIA O CLIENTE ADMIN (IGNORA RLS DO SUPABASE) ===
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        // === 3. TENTA LER O CORPO DA REQUISIÇÃO ===
        let body = {};
        try {
            body = await request.json();
            console.log("[WEBHOOK] Body recebido:", body);
        } catch (e) {
            console.warn("[WEBHOOK] Corpo da requisição vazio ou não é JSON válido.");
        }

        // === 4. TENTA LER OS PARÂMETROS DA URL ===
        const url = new URL(request.url);
        const idFromQuery = url.searchParams.get('data.id') || url.searchParams.get('id');
        const typeFromQuery = url.searchParams.get('type') || url.searchParams.get('topic');

        // === 5. VALIDA SE É UM EVENTO DE PAGAMENTO ===
        const type = body.type || typeFromQuery;
        const action = body.action || '';

        if (type !== 'payment' && !action.includes('payment')) {
            console.log("[WEBHOOK] Ignorando notificação (Não é pagamento). Tipo:", type);
            return NextResponse.json({ message: "Ignorado - Não é notificação de pagamento" }, { status: 200 });
        }

        // === 6. O "CATA-TUDO": BUSCA O ID EM QUALQUER LUGAR ===
        const paymentId = body.data?.id || body.resource?.split('/').pop() || idFromQuery;

        if (!paymentId) {
            console.error("[WEBHOOK] Falha: ID do pagamento não encontrado em lugar nenhum.");
            return NextResponse.json({ 
                error: "ID não encontrado", 
                bodyEnviado: body, 
                urlEnviada: url.searchParams.toString() 
            }, { status: 400 });
        }

        console.log(`[WEBHOOK] Processando pagamento ID MP: ${paymentId}`);

        // === 7. BUSCA A VENDA NO BANCO ===
        const { data: venda, error: erroVenda } = await supabaseAdmin
            .from('venda')
            .select('idturma, status')
            .eq('mp_payment_id', paymentId.toString())
            .maybeSingle();

        if (erroVenda) {
            console.error("[WEBHOOK] Erro ao buscar no Supabase:", erroVenda);
            return NextResponse.json({ error: "Erro ao buscar banco", detalhe: erroVenda }, { status: 500 });
        }

        if (!venda) {
            console.warn(`[WEBHOOK] Venda não encontrada para o ID MP ${paymentId}`);
            return NextResponse.json({ message: "Venda não encontrada no banco", idProcurado: paymentId }, { status: 200 });
        }

        if (venda.status === 'pago') {
            console.log(`[WEBHOOK] Pedido ${paymentId} já estava pago. Ignorando.`);
            return NextResponse.json({ message: "Já estava pago" }, { status: 200 });
        }

        // === 8. BUSCA CREDENCIAIS DA LOJA/TURMA ===
        const { data: credencial, error: errCredencial } = await supabaseAdmin
            .from('admin')
            .select('acess_token')
            .eq('idturma', venda.idturma)
            .single();

        if (errCredencial || !credencial || !credencial.acess_token) {
            console.error(`[WEBHOOK] Credencial inválida para a turma ${venda.idturma}`);
            return NextResponse.json({ error: "Credencial da loja não encontrada" }, { status: 500 });
        }

        // === 9. CONSULTA STATUS OFICIAL NO MERCADO PAGO ===
        try {
            const client = new MercadoPagoConfig({ accessToken: credencial.acess_token });
            const payment = new Payment(client);
            const paymentData = await payment.get({ id: paymentId });

            console.log(`[WEBHOOK] Status no MP para o ID ${paymentId}: ${paymentData.status}`);

            // === 10. ATUALIZA O BANCO SE FOI APROVADO ===
            if (paymentData.status === 'approved') {
                const { error: dbError } = await supabaseAdmin
                    .from('venda')
                    .update({ status: 'pago' })
                    .eq('mp_payment_id', paymentId.toString()); 

                if (dbError) {
                    console.error("[WEBHOOK] Erro ao salvar o status 'pago':", dbError);
                    return NextResponse.json({ error: "Erro ao atualizar banco", detalhe: dbError }, { status: 500 });
                }
                
                console.log(`[WEBHOOK] SUCESSO! Venda ${paymentId} atualizada para 'pago'.`);
            }

            // Retorna 200 para o Mercado Pago parar de tentar enviar a notificação
            return NextResponse.json({ success: true, status_mp: paymentData.status }, { status: 200 });
            
        } catch (mpError) {
            console.error("[WEBHOOK] Falha ao consultar API do Mercado Pago:", mpError.message);
            return NextResponse.json({ error: "Erro no SDK MP", detalhe: mpError.message }, { status: 500 });
        }

    } catch (error) {
        console.error("[WEBHOOK] Erro CRÍTICO não tratado:", error);
        return NextResponse.json({ error: "Erro fatal no webhook", detalhe: error.message }, { status: 500 });
    }
}