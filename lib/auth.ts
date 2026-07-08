import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

const fallbackAuthUrl = process.env.NEXTAUTH_URL ??
  process.env.URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

if (fallbackAuthUrl) {
  process.env.NEXTAUTH_URL = fallbackAuthUrl;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log("[v0] Auth authorize called with email:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("[v0] Missing email or password");
          return null;
        }

        try {
          const user = await prisma.manager.findUnique({
            where: {
              email: credentials.email,
            },
          });

          console.log("[v0] User found:", user ? "yes" : "no");

          if (!user) {
            console.log("[v0] User not found in database");
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          console.log("[v0] Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            console.log("[v0] Invalid password");
            return null;
          }

          console.log("[v0] Auth successful for user:", user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("[v0] Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
