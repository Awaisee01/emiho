// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      profile?: {
        bio?: string;
        location?: string;
        website?: string;
      };
      subscription?: {
        plan?: string;
        status?: string;
      };
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    profile?: {
      bio?: string;
      location?: string;
      website?: string;
    };
    subscription?: {
      plan?: string;
      status?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}