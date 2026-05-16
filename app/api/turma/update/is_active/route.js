import { NextResponse } from "next/server";
import { CreateClient } from "@/lib/supabase/server";

export async function PUT(req) {
    const supabase = await CreateClient();
    
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const searchParams = new URL(req.url).searchParams;
        const turmaId = searchParams.get("id");
        if (!turmaId) return NextResponse.json({ error: "ID da turma é obrigatório" }, { status: 400 });

        const body = await req.json();
        if (body.is_active === undefined) return NextResponse.json({ error: "Campo 'is_active' é obrigatório" }, { status: 400 });

        const { error: updateError } = await supabase
            .from("turma")
            .update({ is_active: body.is_active })
            .eq("idturma", turmaId);
        
        if (updateError) throw new Error(updateError.message);

        return NextResponse.json({ message: "Status da turma atualizado com sucesso!" }, { status: 200 });

    } catch (error) {
        console.error("Erro ao atualizar status da turma:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
