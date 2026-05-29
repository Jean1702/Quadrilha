// app/api/order-notification/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const payloadJson = await request.json();
        
        // Dados esperados no corpo da requisição (passados na hora da compra)
        const phoneComMais = payloadJson.phone; // Ex: "+5511999999999"
        const pedidoId = payloadJson.pedidoId;   // Ex: 124

        if (!phoneComMais || !pedidoId) {
            return NextResponse.json({ error: "Telefone e ID do pedido são obrigatórios." }, { status: 400 });
        }
        
        // Remove o "+" para enviar à API de WhatsApp
        const formatado = phoneComMais.replace("+", "");

        // Mensagem formatada exatamente nos moldes do exemplo enviado
        const mensagemFormatada = `*IFFOOD Informa!* \n\nO seu pedido *#${pedidoId}* foi solicitado para as turmas. Fique atento ao aplicativo para acompanhar o andamento!`;

        const payloadWhatsApp = {
            to: formatado,
            type: 'text',
            text: mensagemFormatada
        };

        // Dispara o servidor de WhatsApp
        const response = await fetch('http://164.163.33.150:8001/api/v1/sessions/3c993713-6d8e-4fab-9bea-491e9af3ed92/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': process.env.WHATSAPP_API_KEY
            },
            body: JSON.stringify(payloadWhatsApp)
        });

        if (!response.ok) {
            const erroAPI = await response.text();
            console.error("Erro na API de WhatsApp ao notificar pedido criado:", erroAPI);
            return new NextResponse("Erro ao enviar mensagem de confirmação", { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Notificação de pedido enviada." });

    } catch (error) {
        console.error("Erro interno no Order Notification Hook:", error.message);
        return new NextResponse("Erro Interno", { status: 500 });
    }
}