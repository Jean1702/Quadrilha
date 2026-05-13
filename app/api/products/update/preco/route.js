import { NextResponse } from "next/server";
import { CreateClient } from "@/lib/supabase/server";

export async function PUT(req) {
    const supabase = await CreateClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        
        const searchParams = new URL(req.url).searchParams;
        const productId = searchParams.get("id");
        if (!productId) return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: 400 });

        const body = await req.json();
        if (body.preco === undefined) return NextResponse.json({ error: "Campo 'preco' é obrigatório" }, { status: 400 });

        const { error: updateError } = await supabase
            .from("produtos")
            .update({ preco: parseFloat(body.preco) })
            .eq("idproduto", productId);

        if (updateError) throw new Error(updateError.message);

        return NextResponse.json({ message: "Sucesso!" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}