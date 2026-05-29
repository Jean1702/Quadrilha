import { NextResponse } from 'next/server';
import { CreateClient } from '../../../lib/supabase/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function POST(request) {
    try {
        const supabase = await CreateClient();
        const body = await request.json();
        console.log("=== WEBHOOK RECEBIDO DO MERCADO PAGO ===", body);

        if (body.type === 'payment' || body.action?.includes('payment')) {
            const paymentId = body.data?.id || body.resource?.split('/').pop();

            if (!paymentId) {
                return NextResponse.json({ message: "ID do pagamento não encontrado" }, { status: 400 });
            }

            console.log(`[WEBHOOK] Buscando venda vinculada ao ID MP: ${paymentId}`);

            // 1. Descobre a qual turma esse pagamento pertence
            const { data: venda, error: erroVenda } = await supabase
                .from('venda')
                .select('idturma')
                .eq('mp_payment_id', paymentId.toString())
                .maybeSingle();

            if (erroVenda || !venda) {
                console.warn(`[WEBHOOK] Venda ainda não registrada ou não encontrada para o ID MP ${paymentId}`);
                return NextResponse.json({ message: "Venda não encontrada no banco" }, { status: 200 }); 
                // Retornamos 200 para o MP não ficar reenviando caso seja apenas delay de inserção no banco
            }

            // 2. Busca o token de acesso daquela turma específica
            const { data: credencial, error: errCredencial } = await supabase
                .from('admin')
                .select('acess_token') 
                .eq('idturma', venda.idturma)
                .single();

            if (errCredencial || !credencial || !credencial.acess_token) {
                console.error("[WEBHOOK] Credencial de acesso da turma não localizada.");
                return NextResponse.json({ message: "Erro de credenciais da subconta" }, { status: 400 });
            }

            console.log(`[WEBHOOK] Inicializando SDK com o token da Turma: ${venda.idturma}`);

            // 3. Inicializa o SDK com o Token correto (da subconta/turma)
            const client = new MercadoPagoConfig({ 
                accessToken: credencial.acess_token 
            });
            const payment = new Payment(client);

            const paymentData = await payment.get({ id: paymentId });
            const statusPagamento = paymentData.status; 

            console.log(`[WEBHOOK] Status retornado pelo MP: ${statusPagamento}`);

            if (statusPagamento === 'approved') {
                console.log(`[WEBHOOK] Pagamento aprovado! Atualizando Supabase...`);

                const { error: dbError } = await supabase
                    .from('venda') 
                    .update({ status: 'pago' })
                    .eq('idvenda', paymentId.toString());

                if (dbError) {
                    console.error("[WEBHOOK] Erro ao atualizar o Supabase:", dbError);
                    return NextResponse.json({ message: "Erro ao atualizar banco" }, { status: 500 });
                }

                console.log(`[WEBHOOK] Venda ${paymentId} atualizada com sucesso para 'pago'!`);
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error("[WEBHOOK] Erro crítico no processamento:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}