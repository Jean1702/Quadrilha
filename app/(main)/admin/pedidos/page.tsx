import PedidosPage from "@/components/pedidosAdmin"
import { CreateClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function Pedido() {
    
    const supabase = await CreateClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/loginadm');
    }

    const { data: adminData, error: adminError } = await supabase
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

    // 1. Corrigido: Removida a vírgula sobrando no final do select
    let queryVendas = supabase
        .from("venda")
        .select(`
            *,
            usuarios (*),
            venda_produto(
                quantidade,
                observacao,
                produtos(*)
            )
        `)
        .order('criada_em', { ascending: false })
        .in("status", [ "sendo_feito", "pago", "pronto"]);

    // 2. Corrigido: Removido o filtro aninhado inválido que quebrava a query
    if (!adminData.is_superadmin) {
        queryVendas = queryVendas.eq("idturma", adminData.idturma);
    } 
    
    let { data: venda, error: vendaError } = await queryVendas;
    
    if (vendaError) {
        console.error("Erro REAL ao buscar vendas:", vendaError.message); // Agora vai mostrar exatamente se der erro
        venda = [];
    }

    return (
        <>
            <PedidosPage vendas={venda || []} adminData={adminData} />
        </>
    )
}