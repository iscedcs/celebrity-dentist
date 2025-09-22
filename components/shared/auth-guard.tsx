"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.data?.error === "RefreshAccessTokenError") {
      signOut({ redirect: false }).then(() => {
        router.push("/sign-in");
      });
    }
  }, [session, router]);

  return <>{children}</>;
}

export default AuthGuard;
