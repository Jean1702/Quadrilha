import { NextResponse } from "next/server";
import { CreateClient } from "@/lib/supabase/server";

export async function POST(req){
    const supabase = await CreateClient();
    try{
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const { data : adminData, error : adminError } = await supabase
          .from("admin")
          .select('*')
          .eq("user_id", user.id) 
          .single(); 
          
          if (adminError || !adminData) {
            console.error("Acesso negado: Usuário comum tentou acessar o admin.");
            redirect('/loginadm'); 
        }
        
        const searchParams = new URL(req.url).searchParams;
        const idturma = searchParams.get("idturma");
        if (!idturma) return NextResponse.json({ error: "ID da turma é obrigatório" }, { status: 400 });
        
        const body = await req.json();
        const { itensPedido, metodo, dataehora, valor } = body;

        if (!itensPedido || !Array.isArray(itensPedido) || itensPedido.length === 0) {
            return NextResponse.json({ error: "O campo 'itensPedido' deve ser um array não vazio" }, { status: 400 });
        }

        if (!metodo) return NextResponse.json({ error: "O campo 'metodo' é obrigatório" }, { status: 400 });
        if (!dataehora) return NextResponse.json({ error: "O campo 'dataehora' é obrigatório" }, { status: 400 });
        if (!valor) return NextResponse.json({ error: "O campo 'valor' é obrigatório" }, { status: 400 });
        const iduser = adminData.id;
        
        const { data: vendaData, error: vendaError } = await supabase
            .from("venda")
            .insert({
                idadmin: iduser,
                metodo_pagamento: metodo,
                valor_total: valor,
                criada_em: new Date(dataehora).toISOString(),
                status: "pago",
                online: false,
                idturma: idturma,
            })
            .select("idvenda")
            .single();

        if (vendaError) throw new Error(vendaError.message);

        const produtosParaInserir = itensPedido.map(item => ({
            idvenda: vendaData.idvenda,
            idproduto: item.id,
            quantidade: item.quantidade,
        }));

        const { error: errorvendasprodutos } = await supabase
            .from("venda_produto")
            .insert(produtosParaInserir);

        if (errorvendasprodutos) {
            console.error("Erro ao salvar os itens:", errorvendasprodutos);
            throw new Error(errorvendasprodutos.message); 
        } else {
            console.log("Todos os itens salvos com sucesso!");
        }

        return NextResponse.json({ message: "Pedido inserido com sucesso!" }, { status: 201 });
        
    } catch (error) {
        console.error("Erro no servidor:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}