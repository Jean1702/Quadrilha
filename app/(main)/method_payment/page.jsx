import MethodPaymentPage from "../../../components/MethodPaymentPage";
import { CreateClient } from '@/lib/supabase/server';

export default async function Pagamento() {


    const supabase = await CreateClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/register');
    }

    return (
        <MethodPaymentPage />
    );
}