import LoginPage from "../../components/LoginPage";
import {CreateClient} from "../../lib/supabase/server.ts"

export default  function login(){

    async function loginAction(FormData) {
        "use server"
        const supabase = await CreateClient();

        const { data: { user }, error } = await supabase.auth.signInAnonymously();
        if (error) throw error;
        
        const {}
    return(
        <>
            <LoginPage />
        </>
    )
}
