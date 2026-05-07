import type { NextAuthConfig } from 'next-auth';

// Edge-safe config — no Node.js-only imports.
// Used directly by middleware.
export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {},
  providers: [],
};
