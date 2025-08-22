import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    // error?: string;
    user: {
      id: string;
      role: string;
      email: string;
      firstName: string;
      lastName: string;
      accessToken?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    accessToken?: string;
    // refreshToken?: string;
    role: string;
  }

  declare module "next-auth/jwt" {
    interface JWT {
      id: string;
      email: string;
      role: string;
      accessToken?: string;
    }
  }
}
