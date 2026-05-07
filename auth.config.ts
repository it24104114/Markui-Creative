import type { NextAuthConfig } from 'next-auth';

// Edge-safe config — no Node.js-only imports.
// Used directly by middleware.
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === '/admin/login';

      if (isLoginPage) {
        // Logged-in user hits login page → send to dashboard
        if (isLoggedIn) return Response.redirect(new URL('/admin/dashboard', nextUrl));
        return true; // Not logged in → show login page
      }

      // All other /admin/* routes require login
      return isLoggedIn;
    },
  },
  providers: [],
};
