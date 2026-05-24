import PresencialPage from "@/components/presencialAdmin";
import { CreateClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export default async function Presencial() {
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
        venda_produto!inner(
            quantidade,
            observacao,
            produtos!inner(
                *
            )
        )
    
  `)
  .order('criada_em', { ascending: false })
  .in("status", [ "cancelada", "entregue"]);

  if (!adminData.is_superadmin) {
    vendas = vendas.eq("idturma", adminData.idturma);
    vendas = vendas.eq("venda_produto.produtos.idturma", adminData.idturma);
  } 
  
  let produtos = supabase
    .from("produtos")
    .select("*");

  if (!adminData.is_superadmin) {
    produtos = produtos.eq("idturma", adminData.idturma);
}

    let{data: produto, error: produtoError} = await produtos;
  let {data: venda, error: vendaError} = await vendas;

  if(produtoError) {
    console.error("Erro ao buscar produtos:", produtoError);
    produto = [];
  }
  if (vendaError) {
      console.error("Erro ao buscar vendas:", vendaError);
      venda = [];
  }

  return <PresencialPage vendas={venda} admindata={adminData} produtos={produto} />;
}