"use server";

import { auth, signIn } from "@/auth";
import { API, URLS } from "@/lib/const";
import { UserProps } from "@/lib/types";

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res === null) {
      return null;
    }
    return res;
  } catch (error: any) {
    console.log("Something went wrong", error);
  }
};

export const getCurrentUser = async () => {
  const url = `${API}${URLS.auth.me}`;
  const session = await auth();
  const BEARER_TOKEN = session?.user.accessToken;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    const success = data.success;
    const user: UserProps = data.data;

    if (success) {
      return user;
    }
    return null;
  } catch (e: any) {
    console.log("", e);
  }
};
