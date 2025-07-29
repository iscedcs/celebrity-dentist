"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { getCurrentUser } from "./auth";
import { revalidatePath } from "next/cache";

export async function createPatientAction(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Extract form data
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const gender = formData.get("gender") as string;
    const address = formData.get("address") as string;
    const emergencyContact = formData.get("emergencyContact") as string;
    const allergies = formData.get("allergies") as string;
    const medications = formData.get("medications") as string;
    const medicalConditions = formData.get("medicalConditions") as string;
    const dentalHistory = formData.get("dentalHistory") as string;
    const notes = formData.get("notes") as string;

    // Get medical checklist items
    const medicalChecklist = formData.getAll("medicalChecklist") as string[];

    // Validate required fields
    if (!firstName || !lastName || !phone || !dateOfBirth) {
      return { success: false, error: "Please fill in all required fields" };
    }

    // Check for duplicate email
    if (email) {
      const { data: existingPatient } = await supabaseAdmin
        .from("patients")
        .select("id")
        .eq("email", email)
        .single();

      if (existingPatient) {
        return {
          success: false,
          error: "A patient with this email already exists",
        };
      }
    }

    // Prepare patient data - let Supabase generate the UUID
    const patientData = {
      first_name: firstName,
      last_name: lastName,
      email: email || null,
      phone,
      date_of_birth: dateOfBirth,
      gender: gender || null,
      address: address || null,
      emergency_contact: emergencyContact || null,
      allergies: allergies || null,
      medications: medications || null,
      medical_conditions: medicalConditions || null,
      dental_history: dentalHistory || null,
      medical_checklist: medicalChecklist,
      notes: notes || null,
      status: "active",
    };

    console.log("Creating patient with data:", patientData);

    const { data: patient, error } = await supabaseAdmin
      .from("patients")
      .insert([patientData])
      .select()
      .single();

    if (error) {
      console.error("Error creating patient:", error);
      return {
        success: false,
        error: `Failed to create patient: ${error.message}`,
      };
    }

    console.log("Patient created successfully:", patient);

    revalidatePath("/patients");
    return { success: true, patientId: patient.id };
  } catch (error) {
    console.error("Error in createPatientAction:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function getPatientsAction() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: patients, error } = await supabaseAdmin
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching patients:", error);
      return { success: false, error: "Failed to fetch patients" };
    }

    // Transform the data to match the expected format
    const transformedPatients =
      patients?.map((patient) => ({
        id: patient.id,
        firstName: patient.first_name,
        lastName: patient.last_name,
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: patient.date_of_birth,
        gender: patient.gender,
        address: patient.address,
        emergencyContact: patient.emergency_contact,
        allergies: patient.allergies,
        medications: patient.medications,
        medicalConditions: patient.medical_conditions,
        dentalHistory: patient.dental_history,
        medicalChecklist: patient.medical_checklist || [],
        notes: patient.notes,
        status: patient.status,
        createdAt: patient.created_at,
        lastVisit: patient.last_visit,
      })) || [];

    return { success: true, patients: transformedPatients };
  } catch (error) {
    console.error("Error in getPatientsAction:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function getPatientByIdAction(patientId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: patient, error } = await supabaseAdmin
      .from("patients")
      .select("*")
      .eq("id", patientId)
      .single();

    if (error) {
      console.error("Error fetching patient:", error);
      return { success: false, error: "Patient not found" };
    }

    // Transform the data to match the expected format
    const transformedPatient = {
      id: patient.id,
      firstName: patient.first_name,
      lastName: patient.last_name,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.date_of_birth,
      gender: patient.gender,
      address: patient.address,
      emergencyContact: patient.emergency_contact,
      allergies: patient.allergies,
      medications: patient.medications,
      medicalConditions: patient.medical_conditions,
      dentalHistory: patient.dental_history,
      medicalChecklist: patient.medical_checklist || [],
      notes: patient.notes,
      status: patient.status,
      createdAt: patient.created_at,
      lastVisit: patient.last_visit,
    };

    return { success: true, patient: transformedPatient };
  } catch (error) {
    console.error("Error in getPatientByIdAction:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function updatePatientAction(
  patientId: string,
  formData: FormData
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Extract form data
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const gender = formData.get("gender") as string;
    const address = formData.get("address") as string;
    const emergencyContact = formData.get("emergencyContact") as string;
    const allergies = formData.get("allergies") as string;
    const medications = formData.get("medications") as string;
    const medicalConditions = formData.get("medicalConditions") as string;
    const dentalHistory = formData.get("dentalHistory") as string;
    const notes = formData.get("notes") as string;

    // Get medical checklist items
    const medicalChecklist = formData.getAll("medicalChecklist") as string[];

    // Validate required fields
    if (!firstName || !lastName || !phone || !dateOfBirth) {
      return { success: false, error: "Please fill in all required fields" };
    }

    // Check for duplicate email (excluding current patient)
    if (email) {
      const { data: existingPatient } = await supabaseAdmin
        .from("patients")
        .select("id")
        .eq("email", email)
        .neq("id", patientId)
        .single();

      if (existingPatient) {
        return {
          success: false,
          error: "A patient with this email already exists",
        };
      }
    }

    const updateData = {
      first_name: firstName,
      last_name: lastName,
      email: email || null,
      phone,
      date_of_birth: dateOfBirth,
      gender: gender || null,
      address: address || null,
      emergency_contact: emergencyContact || null,
      allergies: allergies || null,
      medications: medications || null,
      medical_conditions: medicalConditions || null,
      dental_history: dentalHistory || null,
      medical_checklist: medicalChecklist,
      notes: notes || null,
      updated_at: new Date().toISOString(),
    };

    const { data: patient, error } = await supabaseAdmin
      .from("patients")
      .update(updateData)
      .eq("id", patientId)
      .select()
      .single();

    if (error) {
      console.error("Error updating patient:", error);
      return { success: false, error: "Failed to update patient" };
    }

    revalidatePath("/patients");
    revalidatePath(`/patients/${patientId}`);
    return { success: true };
  } catch (error) {
    console.error("Error in updatePatientAction:", error);
    return { success: false, error: "Internal server error" };
  }
}
