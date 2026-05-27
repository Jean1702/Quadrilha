import { NextResponse } from "next/server";
import { CreateClient } from "@/lib/supabase/server";

export async function PUT(req){
    const supabase = await CreateClient();

    try{
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const searchParams = new URL(req.url).searchParams;
        const pedidoId = searchParams.get("id");
        const novoStatus = searchParams.get("status");
        const body = await req.json();

        const phone = body.phone || "";
        const formatado = phone.replace(/\D/g, "");
        const nome = body.name || "";

        const mensagensStatus = {
            'preparando': `*IFFOOD Informa!* \n\nO seu pedido *#${pedidoId}* já está sendo preparado. Enviaremos uma nova mensagem assim que estiver pronto para retirada.`,
            
            'pronto': `*IFFOOD Informa!* \n\nSeu pedido *#${pedidoId}* está pronto! Você já pode vir fazer a retirada aqui na nossa barraquinha.`,
            
            'entregue': `*IFFOOD Informa!* \n\nPedido *#${pedidoId}* retirado com sucesso. Agradecemos a preferência!`,
            
            'cancelado': `*IFFOOD Informa!* \n\nO seu pedido *#${pedidoId}* foi cancelado e logo cairá o reembolso. Se tiver alguma dúvida, por favor, entre em contato conosco.`
        };

        const mensagemPadrao = `*IFFOOD Informa!* \n\nO status do seu pedido *#${pedidoId}* mudou para: ${novoStatus}.`;
     
        const playload = {
            to: formatado,
            type: 'text',
            text: mensagensStatus[novoStatus] || mensagemPadrao
        };
        
        if (!pedidoId) return NextResponse.json({ error: "ID do pedido é obrigatório" }, { status: 400 });

        if (!novoStatus) return NextResponse.json({ error: "Campo 'status' é obrigatório" }, { status: 400 });
        
        if (novoStatus == "preparando") {
            const { error: updateError } = await supabase
                .from("venda")
                .update({ status: "sendo_feito", atualizada_em: new Date().toISOString() })
                .eq("idvenda", pedidoId);
        
            if (updateError) throw new Error(updateError.message);
        } else if (novoStatus == "pronto") {
            const { error: updateError } = await supabase
                .from("venda")
                .update({ status: "pronto", atualizada_em: new Date().toISOString() })
                .eq("idvenda", pedidoId);
            if (updateError) throw new Error(updateError.message);
        } else if (novoStatus == "entregue") {
            const { error: updateError } = await supabase
                .from("venda")
                .update({ status: "entregue", atualizada_em: new Date().toISOString() })
                .eq("idvenda", pedidoId);
            if (updateError) throw new Error(updateError.message);
        } else if (novoStatus == "cancelado") {
            const { error: updateError } = await supabase
                .from("venda")
                .update({ status: "cancelado", atualizada_em: new Date().toISOString() })
                .eq("idvenda", pedidoId);
            if (updateError) throw new Error(updateError.message);
        } else {
            return NextResponse.json({ error: "Status inválido" }, { status: 400 });
        }

        if (formatado) {
            const response = await fetch('http://164.163.33.150:8001/api/v1/sessions/3c993713-6d8e-4fab-9bea-491e9af3ed92/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': process.env.WHATSAPP_API_KEY
                },
                body: JSON.stringify(playload),
            });

            if (!response.ok) {
                const erroAPI = await response.text();
                console.error("Erro na API de WhatsApp do Hook:", erroAPI);
                return new NextResponse("Erro ao enviar mensagem", { status: 500 });
            }
        } else {
            console.warn("Telefone do cliente não informado. Status atualizado sem envio de WhatsApp.");
        }

        return NextResponse.json({ message: "Status atualizado com sucesso!" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}