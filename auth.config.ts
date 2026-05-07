import type { NextAuthConfig } from 'next-auth';

const firstNonEmpty = (...values: Array<string | undefined>) =>
  values.find((value) => typeof value === 'string' && value.trim().length > 0);

// Edge-safe config — no Node.js-only imports.
// Used directly by middleware.
export const authConfig: NextAuthConfig = {
  trustHost: true,
  secret: firstNonEmpty(process.env.AUTH_SECRET, process.env.NEXTAUTH_SECRET),
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {},
  providers: [],
};
