import { jwtDecode } from "jwt-decode";
import NextAuth, { Session } from "next-auth";
import { type JWT } from "next-auth/jwt";
import authConfig from "./auth.config";
import { API, URLS } from "./lib/const";
import { DecodedToken } from "./lib/types";

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(`${API}${URLS.refreshToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const data = await response.json();
    if (!response.ok) throw data;

    const decoded: DecodedToken = jwtDecode(data.data.accessToken);

    return {
      ...token,
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken ?? token.refreshToken,
      expires_at: decoded.exp * 1000, // convert to ms
    };
  } catch (error) {
    console.log("Refresh token error:", error);
    return {
      id: undefined,
      email: undefined,
      role: undefined,
      accessToken: undefined,
      refreshToken: undefined,
      expires_at: 0,
      error: "RefreshAccessTokenError" as const,
    } as JWT;
  }
}

export const {
  handlers,
  signIn,
  signOut,
  auth,
  handlers: { GET, POST },
} = NextAuth({
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const decoded: DecodedToken = jwtDecode(user.accessToken ?? "");
        // console.log({ token, user });
        return {
          ...token,
          id: user.id,
          email: user.email,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          firstName: user.firstName,
          lastName: user.lastName,
          expires_at: decoded.exp * 1000,
        };
      }

      if (Date.now() < (token.expires_at as number)) {
        return token;
      }

      const refreshedToken = await refreshAccessToken(token);

      if (refreshedToken === null) {
        return { error: "RefreshAccessTokenError" };
      }

      return refreshedToken;
    },

    async session({ token, session }) {
      // console.log({ token, session });
      if (session.user) {
        if (token?.error === "RefreshAccessTokenError") {
          return {
            ...session,
            user: undefined,
            error: "RefreshAccessTokenError",
          } as Session;
        }
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          role: token.role as string,
          accessToken: token.accessToken as string,
          refreshToken: token.refreshToken as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
          expires_at: token.expires_at as number,
        };
      }
      return session as Session;
    },
  },
  ...authConfig,
});
