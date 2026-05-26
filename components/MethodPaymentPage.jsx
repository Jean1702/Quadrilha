'use client'
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';

// Fora do componente: Carrega a chave pública (USE A DE TESTE pk_test_...)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function FormularioDePagamento({ clientSecret }) {
    const stripe = useStripe();
    const elements = useElements();
    const [erro, setErro] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // A Stripe cuida de pegar os dados do PaymentElement e cobrar
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Para onde mandar o cara se der tudo certo
                return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/user`, 
            },
        });

        if (error) {
            setErro(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Esse componente renderiza os campos de cartão seguros */}
            <PaymentElement /> 
            <button disabled={!stripe}>Pagar Agora</button>
            {erro && <span>{erro}</span>}
        </form>
    );
}

// O componente principal da página precisa do Elements
export default function PaginaCheckout() {
    // Você pegaria esse clientSecret fazendo um fetch(POST) para sua api/checkout criada no Passo 2
    const clientSecret = "api/checkout"; 

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <FormularioDePagamento clientSecret={clientSecret} />
        </Elements>
    );
}