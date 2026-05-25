import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {

    const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

    const url = request.nextUrl.clone();

    if (isMaintenanceMode && url.pathname !== '/maintenance') {
        url.pathname = '/maintenance';
        return NextResponse.redirect(url);
    }

    if (!isMaintenanceMode && url.pathname === '/maintenance') {
        url.pathname = '/';

        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};