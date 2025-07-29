"use server";

import { getCurrentUser } from "./auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createClinicalNoteAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Only admin and dentist can create clinical notes
  if (user.role !== "admin" && user.role !== "dentist") {
    return { success: false, error: "Insufficient permissions" };
  }

  try {
    const patientId = formData.get("patientId") as string;
    const treatmentType = formData.get("treatmentType") as string;
    const diagnosis = formData.get("diagnosis") as string;
    const chiefComplaint = formData.get("chiefComplaint") as string;
    const treatment = formData.get("treatment") as string;
    const bloodPressure = formData.get("bloodPressure") as string;
    const pulse = formData.get("pulse") as string;
    const temperature = formData.get("temperature") as string;
    const medications = formData.get("medications") as string;
    const dosageInstructions = formData.get("dosageInstructions") as string;
    const followUpDate = formData.get("followUpDate") as string;
    const followUpInstructions = formData.get("followUpInstructions") as string;
    const additionalNotes = formData.get("additionalNotes") as string;

    // Validate required fields
    if (
      !patientId ||
      !treatmentType ||
      !diagnosis ||
      !chiefComplaint ||
      !treatment
    ) {
      return { success: false, error: "Please fill in all required fields" };
    }

    // Get patient name
    const { data: patient } = await supabaseAdmin
      .from("patients")
      .select("first_name, last_name")
      .eq("id", patientId)
      .single();

    if (!patient) {
      return { success: false, error: "Invalid patient selection" };
    }

    const clinicalNoteData = {
      patient_id: patientId,
      patient_name: `${patient.first_name} ${patient.last_name}`,
      dentist_id: user.userId,
      dentist_name: user.name,
      appointment_id: null, // Would be linked to appointment in real app
      note_date: new Date().toISOString().split("T")[0],
      treatment_type: treatmentType,
      diagnosis,
      chief_complaint: chiefComplaint,
      treatment,
      blood_pressure: bloodPressure || null,
      pulse: pulse || null,
      temperature: temperature || null,
      medications: medications || null,
      dosage_instructions: dosageInstructions || null,
      follow_up_date: followUpDate || null,
      follow_up_instructions: followUpInstructions || null,
      additional_notes: additionalNotes || null,
      status: "completed",
    };

    const { data, error } = await supabaseAdmin
      .from("clinical_notes")
      .insert([clinicalNoteData])
      .select()
      .single();

    if (error) {
      console.error("Error creating clinical note:", error);
      return { success: false, error: "Failed to create clinical note" };
    }

    revalidatePath("/clinical");
    return { success: true, clinicalNoteId: data.id };
  } catch (error) {
    console.error("Error creating clinical note:", error);
    return { success: false, error: "Failed to create clinical note" };
  }
}

export async function getClinicalNotesAction() {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { data: clinicalNotes, error } = await supabaseAdmin
      .from("clinical_notes")
      .select("*")
      .order("note_date", { ascending: false });

    if (error) {
      console.error("Error fetching clinical notes:", error);
      return { success: false, error: "Failed to fetch clinical notes" };
    }

    // Transform the data to match the expected format
    const transformedNotes =
      clinicalNotes?.map((note) => ({
        id: note.id,
        patientId: note.patient_id,
        patientName: note.patient_name,
        dentistId: note.dentist_id,
        dentistName: note.dentist_name,
        appointmentId: note.appointment_id,
        date: note.note_date,
        treatmentType: note.treatment_type,
        diagnosis: note.diagnosis,
        chiefComplaint: note.chief_complaint,
        treatment: note.treatment,
        bloodPressure: note.blood_pressure,
        pulse: note.pulse,
        temperature: note.temperature,
        medications: note.medications,
        dosageInstructions: note.dosage_instructions,
        followUpDate: note.follow_up_date,
        followUpInstructions: note.follow_up_instructions,
        additionalNotes: note.additional_notes,
        status: note.status,
        createdAt: note.created_at,
      })) || [];

    return { success: true, clinicalNotes: transformedNotes };
  } catch (error) {
    console.error("Error fetching clinical notes:", error);
    return { success: false, error: "Failed to fetch clinical notes" };
  }
}

export async function getClinicalNoteByIdAction(noteId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { data: clinicalNote, error } = await supabaseAdmin
      .from("clinical_notes")
      .select("*")
      .eq("id", noteId)
      .single();

    if (error || !clinicalNote) {
      return { success: false, error: "Clinical note not found" };
    }

    // Transform the data to match the expected format
    const transformedNote = {
      id: clinicalNote.id,
      patientId: clinicalNote.patient_id,
      patientName: clinicalNote.patient_name,
      dentistId: clinicalNote.dentist_id,
      dentistName: clinicalNote.dentist_name,
      appointmentId: clinicalNote.appointment_id,
      date: clinicalNote.note_date,
      treatmentType: clinicalNote.treatment_type,
      diagnosis: clinicalNote.diagnosis,
      chiefComplaint: clinicalNote.chief_complaint,
      treatment: clinicalNote.treatment,
      bloodPressure: clinicalNote.blood_pressure,
      pulse: clinicalNote.pulse,
      temperature: clinicalNote.temperature,
      medications: clinicalNote.medications,
      dosageInstructions: clinicalNote.dosage_instructions,
      followUpDate: clinicalNote.follow_up_date,
      followUpInstructions: clinicalNote.follow_up_instructions,
      additionalNotes: clinicalNote.additional_notes,
      status: clinicalNote.status,
      createdAt: clinicalNote.created_at,
    };

    return { success: true, clinicalNote: transformedNote };
  } catch (error) {
    console.error("Error fetching clinical note:", error);
    return { success: false, error: "Failed to fetch clinical note" };
  }
}
