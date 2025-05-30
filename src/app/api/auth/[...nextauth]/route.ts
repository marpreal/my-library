import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: { prompt: "select_account" },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user }) {
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

    async session({ session }) {
      if (!session.user?.email) return session;

      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
          location: true,
          theme: true,
          favoriteGenre: true,
        },
      });

      if (dbUser) {
        session.user = { ...session.user, ...dbUser };
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
