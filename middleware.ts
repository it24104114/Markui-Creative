import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';

export default auth((req: NextRequest & { auth: any }) => {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';
  const isAuthenticated = !!req.auth;

  if (isAdminRoute && !isLoginPage && !isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'],
};
