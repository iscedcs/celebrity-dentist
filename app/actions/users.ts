"use server";

import { getCurrentUser } from "./auth";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function createUserAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Only admin can create users
  if (user.role !== "admin") {
    return { success: false, error: "Insufficient permissions" };
  }

  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    // Validate required fields
    if (!name || !email || !phone || !password || !role) {
      return { success: false, error: "Please fill in all required fields" };
    }

    // Check for duplicate email
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return { success: false, error: "A user with this email already exists" };
    }

    // Validate role
    const validRoles = ["admin", "dentist", "receptionist", "assistant"];
    if (!validRoles.includes(role)) {
      return { success: false, error: "Invalid role selected" };
    }

    const userData = {
      email,
      password_hash: password, // In real app, hash this password
      name,
      role: role as "admin" | "dentist" | "receptionist" | "assistant",
      phone,
      status: "active",
      last_login: null,
    };

    const { data, error } = await supabaseAdmin
      .from("users")
      .insert([userData])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      return { success: false, error: "Failed to create user" };
    }

    return { success: true, userId: data.id };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: "Failed to create user" };
  }
}

export async function getUsersAction() {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Only admin can view all users
  if (user.role !== "admin") {
    return { success: false, error: "Insufficient permissions" };
  }

  try {
    const { data: users, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return { success: false, error: "Failed to fetch users" };
    }

    return { success: true, users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function getUserByIdAction(userId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Only admin can view user details
  if (user.role !== "admin") {
    return { success: false, error: "Insufficient permissions" };
  }

  try {
    const { data: targetUser, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !targetUser) {
      return { success: false, error: "User not found" };
    }

    return { success: true, user: targetUser };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, error: "Failed to fetch user" };
  }
}

export async function updateUserStatusAction(userId: string, status: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Only admin can update user status
  if (user.role !== "admin") {
    return { success: false, error: "Insufficient permissions" };
  }

  try {
    const { error } = await supabaseAdmin
      .from("users")
      .update({
        status: status as "active" | "inactive",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user status:", error);
      return { success: false, error: "Failed to update user status" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating user status:", error);
    return { success: false, error: "Failed to update user status" };
  }
}
