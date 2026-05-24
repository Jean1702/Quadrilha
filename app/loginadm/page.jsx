import LoginAdminPage from "@/components/LoginAdminPage";
import {CreateClient} from "../../lib/supabase/server.ts";
import { redirect } from "next/navigation";

export default function LoginAdminScreen() {
    async function loginadm(formData) {
        "use server"
        const supabase = await CreateClient();
        await supabase.auth.signOut;
        const name = formData.name+"@adm.ifogoiano";
        const {error } = await supabase.auth.signInWithPassword({
            email: name,
            password: formData.password
        });

        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        const data = await supabase
        .from("admin")
        .select("*")
        .eq("nome", formData.name)
        .single();
       
        if (error) throw error
        else if (!data.data) throw new Error("Usuário não encontrado ou sem permissão de acesso.");
        else redirect("/admin");
    }
    return (
        <>
            <LoginAdminPage action={loginadm} />
        </>
    );
}