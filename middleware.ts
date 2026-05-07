import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth(function middleware(req) {
  const isLoggedIn = !!req.auth?.user;
  const { pathname } = req.nextUrl;

  // Login page: let unauthenticated users through; bounce authenticated users to dashboard
  if (pathname === '/admin/login') {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // All other /admin/* routes require authentication
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'],
};


