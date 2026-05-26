import { NextResponse } from "next/server";
import { CreateClient } from "@/lib/supabase/server";

export async function DELETE(req) {
    const supabase = await CreateClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("id");
        if (!productId) return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: 400 });

      const {error: erroDelete} = await supabase
      .from("produtos")
      .update({isActivy: false})

      
        if(erroDelete) throw erroDelete
        return NextResponse.json({ message: "Produto deletado com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        return NextResponse.json({ error: "Erro ao deletar produto" }, { status: 500 });
    }
}
    