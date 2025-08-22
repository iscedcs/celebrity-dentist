"use server";

import { getCurrentUser } from "./auth";

// Dummy data store
let dummyUsers: any[] = [
  {
    id: "u1",
    name: "Admin One",
    email: "admin@example.com",
    phone: "08011111111",
    role: "admin",
    password_hash: "admin123", // ⚠️ dummy only, not secure
    status: "active",
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "u2",
    name: "Dr. Smile",
    email: "dentist@example.com",
    phone: "08022222222",
    role: "dentist",
    password_hash: "dentist123",
    status: "active",
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

// Utility: generate unique IDs
function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function createUserAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) return { success: false, error: "Unauthorized" };
  if (user.role !== "admin")
    return { success: false, error: "Insufficient permissions" };

  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    if (!name || !email || !phone || !password || !role) {
      return { success: false, error: "Please fill in all required fields" };
    }

    // Duplicate email check
    const existingUser = dummyUsers.find((u) => u.email === email);
    if (existingUser) {
      return { success: false, error: "A user with this email already exists" };
    }

    const validRoles = ["admin", "dentist", "receptionist", "assistant"];
    if (!validRoles.includes(role)) {
      return { success: false, error: "Invalid role selected" };
    }

    const newUser = {
      id: generateId("u"),
      name,
      email,
      phone,
      role,
      password_hash: password, // ⚠️ dummy, no hashing
      status: "active",
      last_login: null,
      created_at: new Date().toISOString(),
    };

    dummyUsers.push(newUser);
    return { success: true, userId: newUser.id };
  } catch (err) {
    console.error("Error creating user:", err);
    return { success: false, error: "Failed to create user" };
  }
}

export async function getUsersAction() {
  const user = await getCurrentUser();

  if (!user) return { success: false, error: "Unauthorized" };
  if (user.role !== "admin")
    return { success: false, error: "Insufficient permissions" };

  try {
    // Sort by created_at desc
    const users = [...dummyUsers].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return { success: true, users };
  } catch (err) {
    console.error("Error fetching users:", err);
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function getUserByIdAction(userId: string) {
  const user = await getCurrentUser();

  if (!user) return { success: false, error: "Unauthorized" };
  if (user.role !== "admin")
    return { success: false, error: "Insufficient permissions" };

  try {
    const targetUser = dummyUsers.find((u) => u.id === userId);
    if (!targetUser) {
      return { success: false, error: "User not found" };
    }

    return { success: true, user: targetUser };
  } catch (err) {
    console.error("Error fetching user:", err);
    return { success: false, error: "Failed to fetch user" };
  }
}

export async function updateUserStatusAction(userId: string, status: string) {
  const user = await getCurrentUser();

  if (!user) return { success: false, error: "Unauthorized" };
  if (user.role !== "admin")
    return { success: false, error: "Insufficient permissions" };

  try {
    const index = dummyUsers.findIndex((u) => u.id === userId);
    if (index === -1) return { success: false, error: "User not found" };

    dummyUsers[index].status = status;
    dummyUsers[index].updated_at = new Date().toISOString();

    return { success: true };
  } catch (err) {
    console.error("Error updating user status:", err);
    return { success: false, error: "Failed to update user status" };
  }
}
