import PagamentoPage from "../../components/PagamentoPage";
import Stripe from 'stripe';

export default function Pagamento() {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
    const handleGerarPix = async () => {
    // Confirma o pagamento via Pix
    const { error, paymentIntent } = await stripe.confirmPixPayment(clientSecret, {
        payment_method: {
            billing_details: {
                name: 'Nome do Cliente',
                email: 'email@docliente.com',
            }
        }
    });

    if (paymentIntent && paymentIntent.next_action) {
        // AQUI ESTÁ O SEU QR CODE!
        const qrCodeUrl = paymentIntent.next_action.pix_display_qr_code.image_url_pt;
        const copiaECola = paymentIntent.next_action.pix_display_qr_code.data;
        // Salve isso no estado (useState) e mostre na tela!
    }
};
    return (
        <PagamentoPage />
    );
}