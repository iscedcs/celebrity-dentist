"use server";

import { getCurrentUser } from "./auth";
import { revalidatePath } from "next/cache";

// In-memory dummy patient store
let dummyPatients: any[] = [
  {
    id: "p1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "08011111111",
    dateOfBirth: "1990-05-15",
    gender: "male",
    address: "123 Main St",
    emergencyContact: "Jane Doe - 08022222222",
    allergies: "Penicillin",
    medications: "Ibuprofen",
    medicalConditions: "Hypertension",
    dentalHistory: "Wisdom tooth extraction (2018)",
    medicalChecklist: ["x-ray", "blood-test"],
    notes: "First visit today",
    status: "active",
    createdAt: new Date().toISOString(),
    lastVisit: null,
  },
];

function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function createPatientAction(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

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
    const medicalChecklist = formData.getAll("medicalChecklist") as string[];

    if (!firstName || !lastName || !phone || !dateOfBirth) {
      return { success: false, error: "Please fill in all required fields" };
    }

    // Duplicate email check
    if (email) {
      const exists = dummyPatients.find((p) => p.email === email);
      if (exists) {
        return { success: false, error: "A patient with this email already exists" };
      }
    }

    const newPatient = {
      id: generateId("p"),
      firstName,
      lastName,
      email: email || null,
      phone,
      dateOfBirth,
      gender: gender || null,
      address: address || null,
      emergencyContact: emergencyContact || null,
      allergies: allergies || null,
      medications: medications || null,
      medicalConditions: medicalConditions || null,
      dentalHistory: dentalHistory || null,
      medicalChecklist,
      notes: notes || null,
      status: "active",
      createdAt: new Date().toISOString(),
      lastVisit: null,
    };

    dummyPatients.push(newPatient);

    revalidatePath("/patients");
    return { success: true, patientId: newPatient.id };
  } catch (err) {
    console.error("Error in createPatientAction:", err);
    return { success: false, error: "Internal server error" };
  }
}

export async function getPatientsAction() {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Sort by createdAt desc
    const patients = [...dummyPatients].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return { success: true, patients };
  } catch (err) {
    console.error("Error in getPatientsAction:", err);
    return { success: false, error: "Internal server error" };
  }
}

export async function getPatientByIdAction(patientId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const patient = dummyPatients.find((p) => p.id === patientId);
    if (!patient) return { success: false, error: "Patient not found" };

    return { success: true, patient };
  } catch (err) {
    console.error("Error in getPatientByIdAction:", err);
    return { success: false, error: "Internal server error" };
  }
}

export async function updatePatientAction(patientId: string, formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

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
    const medicalChecklist = formData.getAll("medicalChecklist") as string[];

    if (!firstName || !lastName || !phone || !dateOfBirth) {
      return { success: false, error: "Please fill in all required fields" };
    }

    // Duplicate email check (excluding current)
    if (email) {
      const exists = dummyPatients.find((p) => p.email === email && p.id !== patientId);
      if (exists) {
        return { success: false, error: "A patient with this email already exists" };
      }
    }

    const index = dummyPatients.findIndex((p) => p.id === patientId);
    if (index === -1) return { success: false, error: "Patient not found" };

    dummyPatients[index] = {
      ...dummyPatients[index],
      firstName,
      lastName,
      email: email || null,
      phone,
      dateOfBirth,
      gender: gender || null,
      address: address || null,
      emergencyContact: emergencyContact || null,
      allergies: allergies || null,
      medications: medications || null,
      medicalConditions: medicalConditions || null,
      dentalHistory: dentalHistory || null,
      medicalChecklist,
      notes: notes || null,
      updatedAt: new Date().toISOString(),
    };

    revalidatePath("/patients");
    revalidatePath(`/patients/${patientId}`);
    return { success: true };
  } catch (err) {
    console.error("Error in updatePatientAction:", err);
    return { success: false, error: "Internal server error" };
  }
}
