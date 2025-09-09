import { jwtDecode } from "jwt-decode";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { API, URLS } from "./lib/const";
import { DecodedToken } from "./lib/types";

async function refreshAccessToken(token: any) {
  const url = `${API}${URLS.refreshToken}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const refreshed = await response.json();
    if (!response.ok) throw refreshed;

    const decoded: DecodedToken = jwtDecode(refreshed.data.accessToken);

    return {
      ...token,
      accessToken: refreshed.data.accessToken,
      refreshToken: refreshed.data.refreshToken ?? token.refreshToken,
      expires_at: decoded.exp * 1000,
    };
  } catch (error) {
    console.log("Refresh token error", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

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
        const decoded: DecodedToken = jwtDecode(user.accessToken ?? "");
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.expires_at = decoded.exp * 1000;

        console.log({ token, user });
        return token;
      }

      if (Date.now() < (token.expires_at as number)) {
        return token;
      }

      return await refreshAccessToken(token);
    },

    async session({ token, session }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
        session.user.refreshToken = token.refreshToken as string;
        session.user.lastName = token.lastName as string;
        session.user.firstName = token.firstName as string;
        session.user.expires_at = token.expires_at as number;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
