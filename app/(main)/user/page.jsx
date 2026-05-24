"use server"
import { redirect } from "next/navigation";
import UserPage from "../../../components/UserPage";
import { CreateClient } from "../../../lib/supabase/server";

export default async function User() {
    const supabase = await CreateClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user) {
        redirect('/register');
    }

    const userName = user?.user_metadata?.name || "Usuário Teste"; //const userName = user.user_metadata?.name || user.identities?.[0]?.identity_data?.name || "Usuário";
    const userPhone = user?.user_metadata?.phone || user?.phone || "11999999999"; //const userPhone = user.user_metadata?.phone || user.phone || "Telefone não informado";

    let numbers = userPhone.replace(/\D/g, "");

    if (numbers.startsWith("55") && numbers.length > 11) {
        numbers = numbers.slice(2);
    }

    numbers = numbers
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");


    return (
        <>
            <UserPage name={userName} phone={numbers} />
        </>
    );
}