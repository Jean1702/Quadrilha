import { NextResponse } from 'next/server';
import { CreateClient } from '../../../lib/supabase/server';

export async function POST(request) {
    try {
        const supabase = await CreateClient();
        const body = await request.json();
        console.log("=== WEBHOOK RECEBIDO DO MERCADO PAGO ===", body);

        // O Advanced Payments avisa tanto em 'payment' quanto em outros tópicos estruturais, ideal validar o ID
        if (body.type === 'payment' || body.action?.includes('payment')) {
            
            // Captura o ID do Advanced Payment de forma segura
            const paymentId = body.data?.id || body.resource?.split('/').pop();

            if (!paymentId) {
                return NextResponse.json({ message: "ID do pagamento não encontrado" }, { status: 400 });
            }

            console.log(`Consultando status do pagamento mestre ${paymentId} no Mercado Pago...`);

            // Consulta utilizando a API de Advanced Payments para capturar o split inteiro e garantir segurança antifraude
            const mpResponse = await fetch(`https://api.mercadopago.com/v1/advanced_payments/${paymentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.MERCADO_PAGO_MASTER_ACCESS_TOKEN}` // Token mestre da plataforma
                }
            });

            // Se falhar, tenta consultar como pagamento individual clássico por redundância do gateway
            let paymentData;
            if (!mpResponse.ok) {
                console.warn(`Tentando consulta redundante para v1/payments/${paymentId}`);
                const fallbackResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${process.env.MERCADO_PAGO_MASTER_ACCESS_TOKEN}` }
                });
                
                if (!fallbackResponse.ok) {
                    console.error(`Erro crítico ao consultar pagamento ${paymentId} em ambas as APIs do MP`);
                    return NextResponse.json({ message: "Erro ao consultar MP" }, { status: 500 });
                }
                paymentData = await fallbackResponse.json();
            } else {
                paymentData = await mpResponse.json();
            }

            const statusPagamento = paymentData.status; // 'approved', 'pending', etc.
            const externalReference = paymentData.external_reference; 

            console.log(`Status do pagamento ${paymentId}: ${statusPagamento} | Ref: ${externalReference}`);

            // Se o pagamento geral foi APROVADO, atualiza todas as vendas vinculadas a esse ID mestre do MP
            if (statusPagamento === 'approved') {
                console.log(`Pagamento aprovado! Atualizando vendas no banco de dados...`);

                // ATENÇÃO AQUI: Nós filtramos e atualizamos pelo 'mp_payment_id' que gravamos no checkout!
                const { data: vendasAtualizadas, error: dbError } = await supabase
                    .from('venda') 
                    .update({ status: 'pago' })
                    .eq('mp_payment_id', paymentId.toString()); // Atualiza todas as lojas desse carrinho unificado

                if (dbError) {
                    console.error("Erro ao atualizar o Supabase:", dbError);
                    return NextResponse.json({ message: "Erro ao atualizar banco" }, { status: 500 });
                }

                console.log(`Vendas associadas ao ID MP ${paymentId} atualizadas com sucesso para 'pago'!`);
            }
        }

        // Resposta imediata exigida pelo Mercado Pago
        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error("Erro crítico no Webhook:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}