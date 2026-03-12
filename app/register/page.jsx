import RegisterPage from "../../components/RegisterPage"
import {CreateClient} from "../../lib/supabase/server.ts"

export default  function Register(){
    
    async function registerAction(formData){
        "use server"
        const supabase = await CreateClient();
       

        const { data, error } = await supabase.auth.signInAnonymously({
            options: {
                data: { 
                    name: formData.get("name"),
                    phone: formData.get("phone")
                } 
            }
        });
        if (error) {
            console.error("Erro no cadastro:", error.message);
            return;
        }

        console.log("Usuário logado anonimamente:", data);
    }
   
    return(
        <>
            <RegisterPage actions={registerAction}/>
        </>
    )
}