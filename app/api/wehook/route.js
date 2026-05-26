import { NextResponse } from 'next/server';
import { CreateClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});


export async function POST(request) {
    const signature = request.headers.get('stripe-signature');
    const rawBody = await request.text();

    let event;

    try {
        // Verifica se a requisição realmente veio da Stripe usando o Webhook Secret
        event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Erro na assinatura do Webhook da Stripe:', err.message);
        return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

    // Se o pagamento deu certo...
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;        
        // Pega os IDs que guardamos lá no Passo 6
        const vendasIdsString = paymentIntent.metadata.vendas_ids;        
        if (vendasIdsString) {
            const arrayDeIds = vendasIdsString.split(',').map(id => parseInt(id));
            const supabase = await CreateClient();

            // Atualiza TODAS as vendas daquele carrinho para 'pago'
            const { error } = await supabase
                .from('venda')
                .update({ status: 'pago' })
                .in('idvenda', arrayDeIds);

            if (error) {
                console.error("Erro ao atualizar vendas no Supabase:", error);
                return NextResponse.json({ error: 'Erro no banco' }, { status: 500 });
            }
        }
    }

    return NextResponse.json({ received: true }, { status: 200 });
}