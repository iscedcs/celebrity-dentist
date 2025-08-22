"use server";

import { getCurrentUser } from "./auth";

// Dummy patients
const dummyPatients = [
  { id: "p1", first_name: "John", last_name: "Doe", phone: "123-456-7890" },
  { id: "p2", first_name: "Jane", last_name: "Smith", phone: "987-654-3210" },
  { id: "p3", first_name: "Alice", last_name: "Johnson", phone: "555-123-4567" },
];

// Dummy dentists
const dummyDentists = [
  { id: "d1", name: "Dr. Emily Brown", phone: "111-222-3333" },
  { id: "d2", name: "Dr. Michael Green", phone: "444-555-6666" },
];

// Dummy stats
const dummyStats = {
  totalPatients: 120,
  todayAppointments: 8,
  pendingAppointments: 15,
  totalUsers: 12,
};

// Dummy activity
const dummyAppointments = [
  {
    id: "a1",
    patient_name: "John Doe",
    dentist_name: "Dr. Emily Brown",
    appointment_date: "2025-08-22",
    start_time: "10:00",
    status: "scheduled",
    type_name: "Checkup",
  },
  {
    id: "a2",
    patient_name: "Jane Smith",
    dentist_name: "Dr. Michael Green",
    appointment_date: "2025-08-22",
    start_time: "11:00",
    status: "completed",
    type_name: "Filling",
  },
];

const dummyRecentPatients = [
  { id: "p10", first_name: "Robert", last_name: "Taylor", created_at: "2025-08-21T14:32:00Z" },
  { id: "p11", first_name: "Laura", last_name: "Wilson", created_at: "2025-08-20T10:15:00Z" },
  { id: "p12", first_name: "Kevin", last_name: "Brown", created_at: "2025-08-19T09:45:00Z" },
];

// === Actions ===

export async function getPatientsForDropdownAction() {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const transformedPatients = dummyPatients.map((p) => ({
    id: p.id,
    name: `${p.first_name} ${p.last_name}`,
    phone: p.phone,
  }));

  return { success: true, patients: transformedPatients };
}

export async function getDentistsForDropdownAction() {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const transformedDentists = dummyDentists.map((d) => ({
    id: d.id,
    name: d.name,
    specialization: "General Dentistry",
  }));

  return { success: true, dentists: transformedDentists };
}

export async function getDashboardStatsAction() {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  return { success: true, stats: dummyStats };
}

export async function getRecentActivityAction() {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const transformedPatients = dummyRecentPatients.map((p) => ({
    id: p.id,
    name: `${p.first_name} ${p.last_name}`,
    createdAt: p.created_at,
  }));

  return {
    success: true,
    activity: {
      recentAppointments: dummyAppointments,
      recentPatients: transformedPatients,
    },
  };
}
