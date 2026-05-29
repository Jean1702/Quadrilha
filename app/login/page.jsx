import LoginPage from "../../components/LoginPage";
import { CreateClient } from "../../lib/supabase/server.ts"
import { redirect } from "next/navigation"

export default function login() {

    async function sendWhatsAppMessage(phoneInput) {
        "use server"

        const numbers = phoneInput.replace(/\D/g, "");
        const formatado = `+55${numbers}`;

        try {
            const supabase = await CreateClient();

            // 1. NOVO: Verifica se o usuário já tem conta ANTES de enviar o OTP
            const { data: userData, error: userError } = await supabase
                .from('usuarios')
                .select('id')
                .eq('phone', formatado)
                .single();

            // Se não achar o usuário, abortamos o envio do WhatsApp e avisamos o front-end
            if (userError || !userData) {
                return {
                    success: false,
                    notRegistered: true, // Flag especial para o nosso front-end
                    error: "Conta não encontrada. Você será redirecionado para o cadastro em 5 segundos..."
                };
            }

            // 2. Se o usuário existir, o Supabase gera o OTP e dispara o Hook normalmente
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

        const numbers = phone.replace(/\D/g, "");
        const formatado = `+55${numbers}`;

        let redirectTarget = null;

        try {
            const supabase = await CreateClient();

            const { data, error } = await supabase.auth.verifyOtp({
                phone: formatado,
                token: codigo,
                type: 'sms'
            });

            if (error || !data?.user) {
                console.log("❌ Erro na validação do OTP no Login:", error);
                return { success: false, error: "Código incorreto ou expirado." };
            }

            // Opcional: Como já verificamos antes de enviar, esta segunda checagem é só uma dupla garantia.
            const { data: userData, error: userError } = await supabase
                .from('usuarios')
                .select('id')
                .eq('phone', formatado)
                .single();

            if (userError || !userData) {
                await supabase.auth.signOut();
                redirect("/register")
                return { success: false, error: "Conta não encontrada." };
            }

            redirectTarget = "/user";

        } catch (error) {
            console.error("🚨 Erro inesperado no login:", error.message);
            return { success: false, error: "Erro interno ao fazer login." };
        }

        if (redirectTarget) {
            redirect(redirectTarget);
        }
    }

    return (
        <>
            <LoginPage codigoconfirm={confirmCodeAndLogin} enviarWhatsapp={sendWhatsAppMessage} />
        </>
    )
}
