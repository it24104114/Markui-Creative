import type { NextAuthConfig } from 'next-auth';

// Lightweight config — no Node.js-only imports (bcryptjs, Prisma, etc.)
// Used by middleware which runs on the Edge Runtime.
export const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === '/admin/login';

      if (isLoginPage) {
        // Already logged in → send to dashboard
        if (isLoggedIn) return Response.redirect(new URL('/admin/dashboard', nextUrl));
        return true;
      }

      // All other /admin/* routes require auth
      if (isLoggedIn) return true;
      return false; // Triggers redirect to signIn page
    },
  },
  providers: [], // Providers only needed in auth.ts (Node.js runtime)
};
