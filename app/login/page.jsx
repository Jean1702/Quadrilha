import LoginPage from "../../components/LoginPage";
import {CreateClient} from "../../lib/supabase/server.ts"
import { redirect } from "next/navigation"

export default  function login(){

    async function sendWhatsAppMessage(phoneInput) {
        "use server"

        const numbers = phoneInput.replace(/\D/g, "");
        // ⚠️ ATENÇÃO: O Supabase Auth exige o sinal de "+" antes do código do país para autenticação por telefone!
        const formatado = `+55${numbers}`; 

        try {
            const supabase = await CreateClient();

            // O Supabase gera o OTP internamente e vai disparar o Hook que vamos configurar
            const { error } = await supabase.auth.signInWithOtp({
                phone: formatado,
            });

            if (error) {
                console.error("❌ Erro ao solicitar OTP:", error.message);
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async function confirmCodeAndLogin(formData) {
        "use server"
        
        const phone = formData.get ? formData.get('phonesalvo') : formData.phonesalvo;
        const codigo = formData.get ? formData.get('codigo') : formData.codigo;
        const nome =  formData.get ? formData.get('nomesalvo') : formData.nomesalvo;
     
        
        
        const numbers = phone.replace(/\D/g, "");
        const formatado = `+55${numbers}`;
        
        let redirectTarget = null;

        try {
            const supabase = await CreateClient();

            // 1. Valida o código OTP (Igualzinho ao registro)
            const { data, error } = await supabase.auth.verifyOtp({
                phone: formatado,
                token: codigo,
                type: 'sms' 
            });

            // Se o código estiver errado ou expirado, para aqui
            if (error || !data?.user) {
                console.log("❌ Erro na validação do OTP no Login:", error);
                return { success: false, error: "Código incorreto ou expirado." };
            }

            // 2. A MUDANÇA É AQUI 👇: Em vez de insert, fazemos um SELECT
            // Vamos verificar se esse cara realmente já tem um perfil na sua tabela
            const { data: userData, error: userError } = await supabase
                .from('usuarios')
                .select('id')
                .eq('phone', formatado)
                .single();

            // Se der erro no select ou não achar o usuário, significa que ele não tem conta
            if (userError || !userData) {
                console.error("❌ Usuário tentou logar, mas não tem registro na tabela usuarios.");
                
                await supabase.auth.signOut();
                redirect("/register")
                return { success: false, error: "Conta não encontrada. Por favor, faça o cadastro primeiro!" };
            }

            // Se passou por tudo, o login foi um sucesso e a sessão já está criada nos cookies!
            redirectTarget = "/user";

        } catch (error) {
            console.error("🚨 Erro inesperado no login:", error.message);
            return { success: false, error: "Erro interno ao fazer login." };
        }

        // Executa o redirecionamento
        if (redirectTarget) {
            redirect(redirectTarget);
        }
    }
    
    return(
        <>
            <LoginPage codigoconfirm={confirmCodeAndLogin} enviarWhatsapp={sendWhatsAppMessage}/>
        </>
    )
}
