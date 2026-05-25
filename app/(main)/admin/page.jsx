import AdminPage from "@/components/AdminPage"
import { CreateClient } from "../../../lib/supabase/server"
import { redirect } from "next/navigation"

export default async function Admin(){
    const supabase = await CreateClient();

    const { data: { user }, erroradm } = await supabase.auth.getUser();

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

    let products = supabase
    .from("produtos")
    .select(`
        *,
        imagens (*)
    `)
    .eq("isActivy", true);


    if (!adminData.is_superadmin) {
        products = products.eq("idturma", adminData.idturma);
        
    } 
    
    const { data: produtos, error: prodError } = await products;


    if (prodError) {
        console.error("Erro ao carregar produtos:", prodError);
    } 
   

    return(
        <>
            <AdminPage adminData={adminData} produtos={produtos}  />
        </>
    )
}