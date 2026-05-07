import type { NextAuthConfig } from 'next-auth';

// Edge-safe config — no Node.js-only imports.
// Used directly by middleware.
export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === '/admin/login';

      // Always allow the login page through
      if (isLoginPage) return true;

      // All other /admin/* routes require login
      return isLoggedIn;
    },
  },
  providers: [],
};
