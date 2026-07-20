import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcryptjs from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  providers: [
    // ── Google OAuth Provider ──────────────────────────────────────────
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),

    // ── Email + Password (Credentials) Provider ───────────────────────
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1);

        if (!user || !user.passwordHash) return null;

        const isValid = await bcryptjs.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // Persist role into the JWT on sign-in
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role ?? 'CLIENTE';
      }
      // For Google sign-in: upsert user in Neon and attach role
      if (account?.provider === 'google' && profile?.email) {
        const [existing] = await db
          .select({ id: users.id, role: users.role })
          .from(users)
          .where(eq(users.email, profile.email))
          .limit(1);

        if (existing) {
          token.id = String(existing.id);
          token.role = existing.role ?? 'CLIENTE';
        } else {
          const [created] = await db
            .insert(users)
            .values({
              name: profile.name ?? 'Usuario',
              email: profile.email,
              passwordHash: '',
              role: 'CLIENTE',
            })
            .returning({ id: users.id, role: users.role });
          token.id = String(created.id);
          token.role = created.role ?? 'CLIENTE';
        }
      }
      return token;
    },

    // Expose id and role to the session object (available on client)
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});
