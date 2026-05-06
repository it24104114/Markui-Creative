import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'markui-dev-auth-secret-change-in-production',
  });

  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === '/admin/login';
  const isAuthenticated = !!token;

  // Logged in user visiting login → send to dashboard
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  // Unauthenticated user visiting protected admin route → send to login
  if (!isLoginPage && !isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

