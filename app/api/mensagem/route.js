// app/api/auth/sms-hook/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const payloadJson = await request.json();
        
        // O Supabase envia os dados neste formato estruturado:
        const phoneComMais = payloadJson.user.phone; // Ex: "+5511999999999"
        const numeroalet = payloadJson.sms.otp;     // O código gerado pelo Supabase
        
        // Remove o "+" para enviar à tua API de WhatsApp, se necessário
        const formatado = phoneComMais.replace("+", "");

        const payloadWhatsApp = {
            to: formatado,
            type: 'text',
            text: `Seu código de verificação é: ${numeroalet}`
        };

        // Dispara o teu servidor de WhatsApp
        const response = await fetch('http://164.163.33.150:8001/api/v1/sessions/3c993713-6d8e-4fab-9bea-491e9af3ed92/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': process.env.WHATSAPP_API_KEY
            },
            body: JSON.stringify(payloadWhatsApp),
            codigoGerado: numeroalet // Para testes, pode ser útil retornar o código gerado

        });

        if (!response.ok) {
            const erroAPI = await response.text();
            console.error("Erro na API de WhatsApp do Hook:", erroAPI);
            return new NextResponse("Erro ao enviar mensagem", { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Erro interno no SMS Hook:", error.message);
        return new NextResponse("Erro Interno", { status: 500 });
    }
}