import LoginPage from "../../components/LoginPage";
import {CreateClient} from "../../lib/supabase/server.ts"
import { redirect } from "next/navigation"

export default  function login(){

    async function loginAction(FormData) {
        "use server"
        const supabase = await CreateClient();

        const phone = FormData.phone.replace(/\D/g, "");
        const formatado = `+55${phone}`;

        const {data: customer, error: customerError} = await supabase
            .from("customers")
            .select("auth_password")
            .eq("phone", formatado)
            .single();

        if (customerError) throw customerError;


        const { error } = await supabase.auth.signInWithPassword({
            phone: formatado,
            password: customer.auth_password
        });

        if (error) throw error;
        
        redirect("/Produto");
    }
    
    return(
        <>
            <LoginPage action={loginAction} />
        </>
    )
}
