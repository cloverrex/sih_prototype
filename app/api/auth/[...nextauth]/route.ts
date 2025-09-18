import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

// Basic NextAuth config using Google. Extend callbacks as needed.
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: 'Dev Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        name: { label: 'Name', type: 'text' },
        role: { label: 'Role', type: 'text', value: 'alumni' }
      },
      async authorize(creds) {
        if (!creds?.email) return null;
        return { id: creds.email, email: creds.email, name: creds.name || 'Dev User', role: creds.role || 'alumni' } as any;
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account, profile }) {
      const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e=>e.trim().toLowerCase()).filter(Boolean);
      if (account && profile) {
        token.email = (profile as any).email;
        token.name = (profile as any).name;
      }
      // Keep role if already set
      if (!(token as any).role && token.email) {
        (token as any).role = adminEmails.includes(String(token.email).toLowerCase()) ? 'admin' : 'alumni';
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).role = (token as any).role || 'alumni';
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
