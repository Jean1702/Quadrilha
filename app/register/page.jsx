import { createClient } from "@supabase/supabase-js";
import RegisterPage from "../../components/RegisterPage"
import {CreateClient} from "../../lib/supabase/server.ts"

export default function Register() {

    // 1. AÇÃO DE ENVIAR O WHATSAPP
    async function sendWhatsAppMessage(phoneInput) {
        "use server"

        // Testa tirar o "+" (se a sua API exigir com +, é só voltar o +55)
        // Se o usuário digitar (62) 99800-2182, o \D tira os símbolos e fica 62998002182
        const numbers = phoneInput.replace(/\D/g, "");

        const formatado = `55${numbers}`;
        const numeroalet = Math.floor(Math.random() * 100000).toString().padStart(5, '0');

        const payload = {
            to: formatado,
            type: 'text',
            text: `Seu código de verificação é: ${numeroalet}`
        };

        try {
            const response = await fetch('http://164.163.33.150:8001/api/v1/sessions/3c993713-6d8e-4fab-9bea-491e9af3ed92/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': 'wap_0beb8d30af0fdfd606f9466aaf6944bac851a347e443eea7'
                },
                body: JSON.stringify(payload)
            });

            // VERIFICA SE A API DEU ERRO (Ex: 400, 401, 500)
            if (!response.ok) {
                const erroDaAPI = await response.text();
                console.error(`❌ Erro da API (Status ${response.status}):`, erroDaAPI);
                return { success: false, error: erroDaAPI };
            }

            const result = await response.json();
            console.log("✅ Mensagem enviada com sucesso:", result);

            return { success: true, codigoGerado: numeroalet };

        } catch (error) {
            console.error("🚨 Erro catastrófico no fetch:", error.message);
            return { success: false, error: error.message };
        }
    }

    // 2. AÇÃO DE CONFIRMAR O CÓDIGO E CRIAR O USUÁRIO
    async function confirmCodeAndRegister(formData) {
        "use server"
        // Aqui o react-hook-form vai mandar tudo junto: { name, phone, codigo }
        console.log("Dados finais recebidos:", formData);
        // const supabase = await createClient();

        // const {data: user, error: erroruser} = supabase.autj
        // Aqui entra a sua lógica do Supabase de criar o usuário!
        // const admin = await CreateAdminClient();
        // ...resto do seu código de registro...
    }

    return (
        <>
            <RegisterPage
                enviarWhatsapp={sendWhatsAppMessage}
                codigoconfirm={confirmCodeAndRegister}
            />
        </>
    )
}