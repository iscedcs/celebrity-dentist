"use server";

import { getCurrentUser } from "./auth";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function getPatientsForDropdownAction() {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { data: patients, error } = await supabaseAdmin
      .from("patients")
      .select("id, first_name, last_name, phone")
      .eq("status", "active")
      .order("first_name", { ascending: true });

    if (error) {
      console.error("Error fetching patients:", error);
      return { success: false, error: "Failed to fetch patients" };
    }

    const transformedPatients =
      patients?.map((patient) => ({
        id: patient.id,
        name: `${patient.first_name} ${patient.last_name}`,
        phone: patient.phone,
      })) || [];

    return { success: true, patients: transformedPatients };
  } catch (error) {
    console.error("Error fetching patients:", error);
    return { success: false, error: "Failed to fetch patients" };
  }
}

export async function getDentistsForDropdownAction() {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { data: dentists, error } = await supabaseAdmin
      .from("users")
      .select("id, name, phone")
      .eq("role", "dentist")
      .eq("status", "active")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching dentists:", error);
      return { success: false, error: "Failed to fetch dentists" };
    }

    const transformedDentists =
      dentists?.map((dentist) => ({
        id: dentist.id,
        name: dentist.name,
        specialization: "General Dentistry", // You can add this field to users table later
      })) || [];

    return { success: true, dentists: transformedDentists };
  } catch (error) {
    console.error("Error fetching dentists:", error);
    return { success: false, error: "Failed to fetch dentists" };
  }
}

export async function getDashboardStatsAction() {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Get total patients
    const { count: totalPatients } = await supabaseAdmin
      .from("patients")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    // Get today's appointments
    const today = new Date().toISOString().split("T")[0];
    const { count: todayAppointments } = await supabaseAdmin
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("appointment_date", today)
      .neq("status", "cancelled");

    // Get pending appointments
    const { count: pendingAppointments } = await supabaseAdmin
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("status", "scheduled")
      .gte("appointment_date", today);

    // Get total users
    const { count: totalUsers } = await supabaseAdmin
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    return {
      success: true,
      stats: {
        totalPatients: totalPatients || 0,
        todayAppointments: todayAppointments || 0,
        pendingAppointments: pendingAppointments || 0,
        totalUsers: totalUsers || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "Failed to fetch dashboard stats" };
  }
}

export async function getRecentActivityAction() {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Get recent appointments
    const { data: recentAppointments, error: appointmentsError } =
      await supabaseAdmin
        .from("appointments")
        .select(
          "id, patient_name, dentist_name, appointment_date, start_time, status, type_name"
        )
        .order("created_at", { ascending: false })
        .limit(5);

    if (appointmentsError) {
      console.error("Error fetching recent appointments:", appointmentsError);
      return { success: false, error: "Failed to fetch recent activity" };
    }

    // Get recent patients
    const { data: recentPatients, error: patientsError } = await supabaseAdmin
      .from("patients")
      .select("id, first_name, last_name, created_at")
      .order("created_at", { ascending: false })
      .limit(3);

    if (patientsError) {
      console.error("Error fetching recent patients:", patientsError);
      return { success: false, error: "Failed to fetch recent activity" };
    }

    const transformedPatients =
      recentPatients?.map((patient) => ({
        id: patient.id,
        name: `${patient.first_name} ${patient.last_name}`,
        createdAt: patient.created_at,
      })) || [];

    return {
      success: true,
      activity: {
        recentAppointments: recentAppointments || [],
        recentPatients: transformedPatients,
      },
    };
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return { success: false, error: "Failed to fetch recent activity" };
  }
}
