"use server";

import { auth, signIn, signOut } from "@/auth";
import { API, URLS } from "@/lib/const";
import { UserProps } from "@/lib/types";
import axios from "axios";

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

export async function resetPassword(token: string, password: string) {
  const url = `${API}${URLS.auth.reset}`;
  try {
    if (!token || !password) {
      return { success: false, error: "Token and password are required" }
    }

    if (password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters long" }
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return {
        success: false,
        error: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }
    }

    const response = await axios.post(
      url,
      {
        token,
        newPassword: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      },
    )

    return { success: true, message: "Password reset successfully" }
  } catch (error) {
    console.error("Password reset error:", error)

    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to reset password"
      return { success: false, error: errorMessage }
    }

    return { success: false, error: "Internal server error" }
  }
}

export async function forgotPassword(email: string) {
  const url = `${API}${URLS.auth.forgot}`;
  try {
    if (!email) {
      return { success: false, error: "Email is required" }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: "Please enter a valid email address" }
    }

    const response = await axios.post(
      url,
      {
        email,
      },
      {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      },
    )

    return { success: true, message: "Password reset link sent successfully" }
  } catch (error) {
    console.error("Forgot password error:", error)

    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to send reset link"
      return { success: false, error: errorMessage }
    }

    return { success: false, error: "Internal server error" }
  }
}

export async function logout() {
    await signOut();
}