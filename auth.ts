import { jwtDecode } from "jwt-decode";
import NextAuth, { Session } from "next-auth";
import { type JWT } from "next-auth/jwt";
import authConfig from "./auth.config";
import { API, URLS } from "./lib/const";
import { DecodedToken } from "./lib/types";

export async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(`${API}${URLS.refreshToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    if (!response.ok) {
      console.log("Failed to refresh");
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }

    const { data } = await response.json();
    if (!data?.accessToken) {
      return { ...token, error: "RefreshAccessTokenError" };
    }

    const decoded: DecodedToken = jwtDecode(data.accessToken);

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? token.refreshToken,
      expires_at: decoded.exp * 1000,
    };
  } catch (err) {
    console.error("Refresh token error:", err);
    return { ...token, error: "RefreshAccessTokenError" };
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
      // Initial sign-in
      if (user) {
        const decoded: DecodedToken = jwtDecode(user.accessToken ?? "");
        return {
          ...token,
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          expires_at: decoded.exp * 1000,
        };
      }

      if (Date.now() < (token.expires_at as number)) {
        return token;
      }
      const refreshedToken = await refreshAccessToken(token);
      if (!refreshedToken) {
        return { ...token, error: "RefreshAccessTokenError" };
      }
      return refreshedToken;
    },

    async session({ token, session }) {
      if (token?.error === "RefreshAccessTokenError") {
        return {
          ...session,
          user: undefined,
          error: "RefreshAccessTokenError",
        } as Session;
      }

      if (session.user) {
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
