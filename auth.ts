import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const {
  handlers,
  signIn,
  signOut,
  auth,
  handlers: { GET, POST },
} = NextAuth({
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      // console.log("JWT Callback - User:", user, "Token:", token);
      return token;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
        session.user.lastName = token.lastName as string;
        session.user.firstName = token.firstName as string;
      }
      // //console.log("Session Callback - Session:", session, "Token:", token);
      return session;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
