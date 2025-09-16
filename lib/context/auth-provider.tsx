"use client";

import { protectedRoutes } from "@/routes";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import { AuthContextValue } from "../types";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const user = session?.user;
  const error = session?.error;

  // console.log({ error });

  const isLoggedIn = !!user && !error;

  useEffect(() => {
    if (
      error === "RefreshAccessTokenError" ||
      (!isLoggedIn && status === "authenticated") ||
      protectedRoutes.includes(pathname)
    ) {
      router.replace("/sign-in");
    }
  }, [error, isLoggedIn, status, router]);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
