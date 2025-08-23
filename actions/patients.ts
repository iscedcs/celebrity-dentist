"use server";

import { auth } from "@/auth";
import { getCurrentUser } from "./auth";
import { revalidatePath } from "next/cache";
import axios from "axios";
import { API, URLS } from "@/lib/const";


interface PatientApiResponse {
  success: boolean
  data: {
    meta: {
      total: number
      page: number
      limit: number
      pages: number
    }
    data: Array<any>
  }
  message: string
}

interface GetPatientsParams {
  page?: number
  limit?: number
  q?: string
  fields?: string
  status?: string
}

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


export async function getPatientByIdAction(patientId: string) {
  const session = await auth()

  const accessToken = session?.user.accessToken;
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };
    try {
      const url = `${API}${URLS.patients.oneById.replace("{id}", patientId)}`;
      const response = await axios.get(url,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });


      if (response.status === 200) {
        const patient = response.data.data;
        return { success: true, patient };
      }
    } catch (err) {
      console.error("Error fetching patient:", err);
    }
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


export async function getPatientsAction(params: GetPatientsParams = {}) {
  const session = await auth()
  try {
    const token = session?.user?.accessToken
    if (!token) {
      return {
        success: false,
        error: "Authentication required",
        patients: [],
        meta: { total: 0, page: 1, limit: 20, pages: 0 },
      }
    }

    const {
      page = 1,
      limit = 20,
      q = "",
      fields = "firstName,patientId,lastName,phone,email,dateOfBirth,createdAt,status,visits",
    } = params

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      fields,
    })

    if (q) {
      queryParams.append("q", q)
    }

    const response = await axios.get<PatientApiResponse>(`${API}/patients?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        accept: "*/*",
      },
    })

    if (response.data.success) {
      // Transform the data to match the component's expected format
      const transformedPatients = response.data.data.data

      return {
        success: true,
        patients: transformedPatients,
        meta: response.data.data.meta,
      }
    } else {
      return {
        success: false,
        error: response.data.message || "Failed to fetch patients",
        patients: [],
        meta: { total: 0, page: 1, limit: 20, pages: 0 },
      }
    }
  } catch (error) {
    console.error("Error fetching patients:", error)

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Authentication failed. Please log in again.",
          patients: [],
          meta: { total: 0, page: 1, limit: 20, pages: 0 },
        }
      }

      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch patients",
        patients: [],
        meta: { total: 0, page: 1, limit: 20, pages: 0 },
      }
    }

    return {
      success: false,
      error: "An unexpected error occurred",
      patients: [],
      meta: { total: 0, page: 1, limit: 20, pages: 0 },
    }
  }
}

export async function searchPatientsAction(searchTerm: string, page = 1, limit = 20, fields = "firstName,patientId,lastName,phone,email,dateOfBirth,createdAt,status,visits") {
  return getPatientsAction({
    page,
    limit,
    q: searchTerm,
    fields,
  })
}

export async function approvePatientAction(patientId: string) {
  const session = await auth()
  try {
    const token = session?.user?.accessToken
    if (!token) {
      return {
        success: false,
        error: "Authentication required",
      }
    }

    const response = await axios.post(`${API}${URLS.patients.approve.replace("{patientId}", patientId)}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (response.data.success) {
      return {
        success: true,
      }
    } else {
      return {
        success: false,
        error: response.data.message || "Failed to approve patient",
      }
    }
  } catch (error) {
    console.error("Error approving patient:", error)
    return {
      success: false,
      error: "Internal server error",
    }
  }
}
