import { createClient } from "@supabase/supabase-js";
import RegisterPage from "../../components/RegisterPage"
import { CreateClient } from "../../lib/supabase/server.ts"
import { redirect } from "next/navigation";

export default function Register() {


    async function sendWhatsAppMessage(phoneInput) {
        "use server"

        const numbers = phoneInput.replace(/\D/g, "");
        const formatado = `+55${numbers}`;

        try {
            const supabase = await CreateClient();

            // 1. NOVO: Verifica se o usuário JÁ TEM conta ANTES de enviar o OTP
            const { data: userData, error: userError } = await supabase
                .from('usuarios')
                .select('id')
                .eq('phone', formatado)
                .single();

            // Se achar o usuário, abortamos o envio do WhatsApp e avisamos o front-end para ir pro login
            if (userData) {
                return {
                    success: false,
                    alreadyRegistered: true, // Flag especial para o nosso front-end
                    error: "Você já possui uma conta! Redirecionando para o login em 5 segundos..."
                };
            }

            // 2. Se o usuário NÃO existir, o Supabase gera o OTP e dispara o Hook normalmente
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

    async function confirmCodeAndRegister(formData) {
        "use server"

        const phone = formData.get ? formData.get('phonesalvo') : formData.phonesalvo;
        const codigo = formData.get ? formData.get('codigo') : formData.codigo;
        const nome = formData.get ? formData.get('nomesalvo') : formData.nomesalvo;

        const numbers = phone.replace(/\D/g, "");
        const formatado = `+55${numbers}`;

        let redirectTarget = null;

        try {
            const supabase = await CreateClient();

            // 1. Valida o código OTP primeiro
            const { data, error } = await supabase.auth.verifyOtp({
                phone: formatado,
                token: codigo,
                type: 'sms'
            });

            await supabase.auth.updateUser({
                data: { display_name: nome }
            });

            // Se o Supabase retornar erro ou não achar o user, para aqui
            if (error || !data?.user) {
                console.log("❌ Erro na validação do OTP:", error);
                return { success: false, error: "Código incorreto ou expirado." };
            }

            // 2. Agora que temos certeza de que o user não existia e o código tá certo, fazemos o insert
            const { data: userData, error: userError } = await supabase
                .from('usuarios')
                .insert({ user_id: data.user.id, phone: formatado, name: nome })
                .select()
                .single();

            if (userError) {
                console.error("❌ Erro ao salvar na tabela usuarios:", userError.message);
                return { success: false, error: "Erro ao criar registro no banco." };
            }

            redirectTarget = "/user";

        } catch (error) {
            console.error("🚨 Erro inesperado na confirmação:", error.message);
            return { success: false, error: "Erro interno ao verificar código." };
        }

        if (redirectTarget) {
            redirect(redirectTarget);
        }
    }

    return (
        <>
            <RegisterPage
                codigoconfirm={confirmCodeAndRegister}
                enviarWhatsapp={sendWhatsAppMessage}
            />
        </>
    )
}