import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CreateClient } from '@/lib/supabase/server';

export async function proxy(request: NextRequest) {
    const url = request.nextUrl.clone();

    if (url.pathname.startsWith('/_next') || url.pathname.startsWith('/api') || url.pathname === '/favicon.ico') {
        return NextResponse.next();
    }

    try {
        const supabase = await CreateClient();

        const { data: configData } = await supabase
            .from('configuracoes')
            .select('em_manutencao')
            .eq('id', 1)
            .single();

        const isMaintenanceMode = configData?.em_manutencao === true;

        if (!isMaintenanceMode) {
            if (url.pathname === '/maintenance') {
                url.pathname = '/';
                return NextResponse.redirect(url);
            }
            return NextResponse.next();
        }

        let isSuperAdmin = false;

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data: adminData } = await supabase
                .from('admin')
                .select('is_superadmin')
                .eq('user_id', user.id)
                .single();

            if (adminData?.is_superadmin === true) {
                isSuperAdmin = true;
            }
        }

        if (!isSuperAdmin && url.pathname !== '/maintenance') {
            url.pathname = '/maintenance';
            return NextResponse.redirect(url);
        }

    } catch (error) {
        console.error("Erro ao verificar modo manutenção e autenticação no proxy:", error);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};