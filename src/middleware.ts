import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ADMIN_ROUTES = ['/dashboard'];
const PROTECTED_POS_ROUTES = ['/pos'];
const AUTH_ROUTES = ['/auth/login', '/auth/register'];

export default auth((req: NextRequest & { auth: any }) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role;
  const isLoggedIn = !!session;

  // ── Redirect authenticated users away from login/register ──────────
  if (isLoggedIn && AUTH_ROUTES.some(r => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // ── Protect Admin routes: ADMINISTRADOR only ───────────────────────
  if (PROTECTED_ADMIN_ROUTES.some(r => pathname.startsWith(r))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/auth/login?callbackUrl=' + pathname, req.url));
    }
    if (role !== 'ADMINISTRADOR') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  // ── Protect POS routes: EMPLEADO or ADMINISTRADOR ─────────────────
  if (PROTECTED_POS_ROUTES.some(r => pathname.startsWith(r))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/auth/login?callbackUrl=' + pathname, req.url));
    }
    if (role !== 'EMPLEADO' && role !== 'ADMINISTRADOR') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  // ── Protect profile: any authenticated user ─────────────────────────
  if (pathname.startsWith('/profile')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/auth/login?callbackUrl=/profile', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/pos/:path*',
    '/profile/:path*',
    '/auth/:path*',
  ],
};
