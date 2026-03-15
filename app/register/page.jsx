import RegisterPage from "../../components/RegisterPage"
import {CreateClient} from "../../lib/supabase/server.ts"

export default  function Register(){
    
    async function registerAction(formData) {
        "use server"
        const supabase = await CreateClient();

        const numbers = formData.phone.replace(/\D/g, "");
        const formatado = `+55${numbers}`;

        const { data, error } = await supabase.auth.signInWithOtp({
            phone: formatado,
            options: {
                data: {
                name: formData.name
                }
            }
        });

        if (error) throw error;

        return data;
    }

    async function confirmCode(formData){
        "use server"
        const supabase = await CreateClient();

        const { data, error } = await supabase.auth.verifyOtp({
        phone: formData.phone,
        token: formData.code,
        type: "sms"
        });

        if (error) throw error;

        console.log("Usuário autenticado:", data.user);

        return data;
    }

    return(
        <>
            <RegisterPage actions={registerAction} codigoconfirm={confirmCode} />
        </>
    )
}