import { NextResponse } from "next/server";
import { CreateClient } from "@/lib/supabase/server";
import { upgradeToPendingSegment } from "next/dist/client/components/segment-cache/cache";

export async function PUT(req){
    const supabase = await CreateClient();

    try{
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const searchParams = new URL(req.url).searchParams;
        const pedidoId = searchParams.get("id");
        const novoStatus = searchParams.get("status");
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
        return NextResponse.json({ message: "Status atualizado com sucesso!" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}