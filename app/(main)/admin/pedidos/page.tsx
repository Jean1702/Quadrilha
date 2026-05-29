import PedidosPage from "@/components/pedidosAdmin"
import { CreateClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function Pedido(){
    
    const supabase = await CreateClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user ) {
        redirect('/loginadm');
    }

    const { data : adminData, error : adminError } = await supabase
    .from("admin")
    .select(`
        *,
        turma (*)
    `)
    .eq("user_id", user.id)
    .single(); 
    
    if (adminError || !adminData) {
        console.error("Acesso negado: Usuário comum tentou acessar o admin.");
        redirect('/loginadm'); 
    }

    let vendas = supabase
    .from("venda")
    .select(`
        *,
        usuarios (*),
        venda_produto(
            quantidade,
            observacao,
            produtos(
                *
            )
        ),
    
    `)
    .order('criada_em', { ascending: false })
    .in("status", [ "sendo_feito", "pago", "pronto"]);

    if (!adminData.is_superadmin) {
        vendas = vendas.eq("idturma", adminData.idturma);
        vendas = vendas.eq("venda_produto.produtos.idturma", adminData.idturma);
    } 
    
    let {data: venda, error: vendaError} = await vendas;
    
    if (vendaError) {
        console.error("Erro ao buscar vendas:", vendaError);
        venda = [];
    }


    return(
        <>
            <PedidosPage vendas={venda} adminData={adminData} />
        </>
    )
}