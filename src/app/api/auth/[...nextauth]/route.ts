import NextAuth, { NextAuthOptions, User, Session, Account } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

// ✅ Use Singleton for Prisma Client to avoid multiple instances
const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // ✅ Save User to Database (Runs Only When Needed)
    async signIn({ user }: { user: User }) {
      if (!user?.email) {
        console.error("❌ No user email received");
        return false;
      }

      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            id: user.id,
            name: user.name || "Anonymous",
            email: user.email,
            image: user.image || null,
          },
        });

        return true;
      } catch (error) {
        console.error("❌ Prisma Error:", error);
        return false;
      }
    },

    // ✅ Attach User ID to the Session
    async session({
      session,
      token,
    }: {
      session: Session;
      token: { sub?: string };
    }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
