import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    bio?: string | null;
    location?: string | null;
    theme?: string | null;
    favoriteGenre?: string | null;
  }

  interface Session {
    user: User;
  }
}
