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
    .select('*')
    .eq("user_id", user.id) 
    .single(); 
    
    if (adminError || !adminData) {
        console.error("Acesso negado: Usuário comum tentou acessar o admin.");
        redirect('/loginadm'); 
    }

    const {data: venda, error: vendaError} = await supabase
    .from("venda")
    .select(`
        *,
        usuarios (*),
        venda_produto(*),
        produtos (*)
    `)
    .order('criada_em', { ascending: false })
    .eq("status", "pago");
    const teste =  {venda}

     if (vendaError) {
        console.error("Erro ao buscar vendas:", vendaError);
     }

    return(
        <>
            <PedidosPage vendas={venda} adminData={adminData} />
        </>
    )
}