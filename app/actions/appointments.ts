"use server";

import { getCurrentUser } from "./auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export async function checkAvailabilityAction({
  date,
  dentistId,
  duration,
}: {
  date: string;
  dentistId: string;
  duration: number;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Get existing appointments for the dentist on the selected date
    const { data: existingAppointments, error } = await supabaseAdmin
      .from("appointments")
      .select("start_time, end_time")
      .eq("appointment_date", date)
      .eq("dentist_id", dentistId)
      .neq("status", "cancelled");

    if (error) {
      console.error("Error checking availability:", error);
      return { success: false, error: "Failed to check availability" };
    }

    // Generate all possible time slots (8:00 AM to 6:00 PM, 30-minute intervals)
    const allSlots = [];
    for (let hour = 8; hour < 18; hour++) {
      allSlots.push(`${hour.toString().padStart(2, "0")}:00`);
      allSlots.push(`${hour.toString().padStart(2, "0")}:30`);
    }

    // Filter out unavailable slots
    const availableSlots = allSlots.filter((slot) => {
      const slotStart = timeToMinutes(slot);
      const slotEnd = slotStart + duration;

      // Check if slot would extend beyond office hours (6:00 PM = 18:00 = 1080 minutes)
      if (slotEnd > 18 * 60) {
        return false;
      }

      // Check for conflicts with existing appointments
      const hasConflict = existingAppointments?.some((apt) => {
        const aptStart = timeToMinutes(apt.start_time);
        const aptEnd = timeToMinutes(apt.end_time);

        // Check if the new slot overlaps with existing appointment
        return slotStart < aptEnd && slotEnd > aptStart;
      });

      return !hasConflict;
    });

    return { success: true, availableSlots };
  } catch (error) {
    console.error("Error checking availability:", error);
    return { success: false, error: "Failed to check availability" };
  }
}

export async function createAppointmentAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const patientId = formData.get("patientId") as string;
    const dentistId = formData.get("dentistId") as string;
    const type = formData.get("type") as string;
    const typeName = formData.get("typeName") as string;
    const date = formData.get("date") as string;
    const startTime = formData.get("startTime") as string;
    const duration = Number.parseInt(formData.get("duration") as string);
    const endTime = formData.get("endTime") as string;
    const notes = (formData.get("notes") as string) || "";

    // Validate required fields
    if (!patientId || !dentistId || !type || !date || !startTime) {
      return { success: false, error: "Please fill in all required fields" };
    }

    // Get patient and dentist names
    const { data: patient } = await supabaseAdmin
      .from("patients")
      .select("first_name, last_name")
      .eq("id", patientId)
      .single();

    const { data: dentist } = await supabaseAdmin
      .from("users")
      .select("name")
      .eq("id", dentistId)
      .single();

    if (!patient || !dentist) {
      return { success: false, error: "Invalid patient or dentist selection" };
    }

    // Check for double booking
    const { data: conflictingAppointment } = await supabaseAdmin
      .from("appointments")
      .select("id")
      .eq("appointment_date", date)
      .eq("dentist_id", dentistId)
      .neq("status", "cancelled")
      .gte("end_time", startTime)
      .lte("start_time", endTime)
      .single();

    if (conflictingAppointment) {
      return {
        success: false,
        error:
          "Time slot is no longer available. Please select a different time.",
      };
    }

    const appointmentData = {
      patient_id: patientId,
      patient_name: `${patient.first_name} ${patient.last_name}`,
      dentist_id: dentistId,
      dentist_name: dentist.name,
      appointment_type: type,
      type_name: typeName,
      appointment_date: date,
      start_time: startTime,
      end_time: endTime,
      duration,
      status: "scheduled",
      notes,
    };

    const { data, error } = await supabaseAdmin
      .from("appointments")
      .insert([appointmentData])
      .select()
      .single();

    if (error) {
      console.error("Error creating appointment:", error);
      return { success: false, error: "Failed to create appointment" };
    }

    revalidatePath("/appointments");
    return { success: true, appointmentId: data.id };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return { success: false, error: "Failed to create appointment" };
  }
}

export async function getAppointmentsAction(date?: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    let query = supabaseAdmin
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (date) {
      query = query.eq("appointment_date", date);
    }

    const { data: appointments, error } = await query;

    if (error) {
      console.error("Error fetching appointments:", error);
      return { success: false, error: "Failed to fetch appointments" };
    }

    // Transform the data to match the expected format
    const transformedAppointments =
      appointments?.map((apt) => ({
        id: apt.id,
        patientId: apt.patient_id,
        patientName: apt.patient_name,
        dentistId: apt.dentist_id,
        dentistName: apt.dentist_name,
        type: apt.appointment_type,
        typeName: apt.type_name,
        date: apt.appointment_date,
        startTime: apt.start_time,
        endTime: apt.end_time,
        duration: apt.duration,
        status: apt.status,
        notes: apt.notes,
        createdAt: apt.created_at,
      })) || [];

    return { success: true, appointments: transformedAppointments };
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return { success: false, error: "Failed to fetch appointments" };
  }
}

export async function updateAppointmentStatusAction(
  appointmentId: string,
  status: string
) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { error } = await supabaseAdmin
      .from("appointments")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", appointmentId);

    if (error) {
      console.error("Error updating appointment status:", error);
      return { success: false, error: "Failed to update appointment status" };
    }

    revalidatePath("/appointments");
    return { success: true };
  } catch (error) {
    console.error("Error updating appointment status:", error);
    return { success: false, error: "Failed to update appointment status" };
  }
}
