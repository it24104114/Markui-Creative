import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';

const authSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || (process.env.NODE_ENV === 'development' ? 'markui-dev-auth-secret-change-in-production' : undefined);

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: authSecret,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        if (!session.user) {
          (session.user as any) = {};
        }

        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        if (!process.env.DATABASE_URL) {
          return null;
        }

        const { email, password } = parsed.data;

        try {
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
              password: true,
            },
          });

          if (!user || !user.password) return null;

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Credentials authorize failed:', error);
          }

          return null;
        }
      },
    }),
  ],
});
