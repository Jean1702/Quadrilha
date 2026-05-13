import AdminPage from "@/components/AdminPage"
import { CreateClient } from "../../../lib/supabase/server"
export default async function Admin(){
    const supabase = await CreateClient();

    const { data: { user }, erroradm } = await supabase.auth.getUser();

    if (!user ) {
    redirect('/login');
    }

    const { data : adminData, error : adminError } = await supabase
    .from("admin")
    .select("*")
    .eq("user_id", user.id) 
    .single(); 
   
    if (adminError || !adminData) {
        console.error("Acesso negado: Usuário comum tentou acessar o admin.");
        redirect('/loja'); 
    }

    let products = supabase
    .from("produtos")
    .select(`
        *,
        imagens (*)
    `);


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