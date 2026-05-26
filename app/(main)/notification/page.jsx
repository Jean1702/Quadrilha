import { redirect } from "next/navigation";
import NotificationPage from "../../components/NotificationPage";
import { CreateClient } from "../../lib/supabase/server";

export default async function Notification() {
    const supabase = await CreateClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/register');
    }

    return <NotificationPage />;
}