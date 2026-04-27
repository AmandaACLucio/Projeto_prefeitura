import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {

    const token = request.cookies.get('auth-token');

    const { pathname } = request.nextUrl;

    const isPublicRoute = pathname === '/login';
    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    
    //'/((?!api|_next/static|_next/image|nav|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/((?!api|_next|static|favicon.ico|.*\\..*).*)',
  ],
};