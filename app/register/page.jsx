import RegisterPage from "../../components/RegisterPage"
import {CreateAdminClient} from "../../lib/supabase/admin.ts"
import { redirect } from "next/navigation"

export default  function Register(){
    

    async function registerAction(formData) {
        "use server"
        const admin = CreateAdminClient();

        const numbers = formData.phone.replace(/\D/g, "");
        const formatado = `+55${numbers}`;
        const password = crypto.randomUUID();

        const { data: userData, error: userError } = await admin.auth.admin.createUser({
            phone: formatado,
            phone_confirm: true,
            password: password,
            meta_user:{
                name: formData.name
            
            }
        });

        if (userError) throw userError;

        const userid = userData.user.id;

        const {error: profileError } = await admin
            .from("customers")
            .insert({
                user_id: userid,
                name: formData.name,
                phone: formatado,
                auth_password: password
            });

        if (profileError) throw profileError;

       
        redirect("/login");
    }

    // USO PRA MAIS TARDE, MAIS PRA FRENTE PRA CONFIRMAR O CODIGO DE VERIFICAÇÃO 
    // async function confirmCode(formData){
    //     "use server"
    //     const supabase = await CreateClient();

    //     const { data, error } = await supabase.auth.verifyOtp({
    //     phone: formData.phone,
    //     token: formData.code,
    //     type: "sms"
    //     });

    //     if (error) throw error;

    //     console.log("Usuário autenticado:", data.user);

    //     return data;
    // }

    return(
        <>
            <RegisterPage actions={registerAction} /* codigoconfirm={confirmCode} */ />
        </>
    )
}