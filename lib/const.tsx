import { Gender, MaritalStatus, Role } from "@prisma/client";
import { GenotypeProps } from "./types";

export const API = process.env.NEXT_PUBLIC_LIVE_BACKEND_URL;
export const URLS = {
  refreshToken: "/auth/refresh",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    me: "/auth/me",
    reset: "/auth/reset-password",
    forgot: "/auth/forgot-password",
  },
  users: {
    create: "/users",
    fetch: "/users",
    one: "/users/{id}",
    update_role: "/users/{id}/role",
    update_user: "/users/{id}",
    activate_user: "/users/{id}/activate",
    delete: "/users/{id}",
  },
  appointment: {
    publicBooking: "/appointments/public-book",
    privateMe: "/appointments/me",
    all: "/appointments",
    one: "/appointments/{id}",
  },
  patients: {
    create: "/patients",
    all: "/patients",
    oneById: "/patients/{id}",
    oneByPatientId: "/patients/one/{patientId}",
    approve: "/patients/{patientId}/approve",
  },
};

export const FIELDS = [
  "id",
  "email",
  "firstName",
  "lastName",
  "phone",
  "role",
  "isActive",
  "lastLogin",
];

export const PATIENTFIELDS = [
  "id",
  "lastName",
  "firstName",
  "patientId",
  "email",
  "phone",
  "status",
  "registrationType",
  "gender",
];

export const Roles: Role[] = [
  "ADMIN",
  "DOCTOR",
  "FRONTDESK",
  "NURSE",
  "PATIENT",
  "SUPERADMIN",
];

export const MEDICAL_CONDITIONS = [
  "High Blood Pressure",
  "Diabetes",
  "Heart Disease",
  "Asthma",
  "Allergies",
  "Pregnancy",
  "Blood Disorders",
  "Kidney Disease",
  "Liver Disease",
  "Cancer",
  "HIV/AIDS",
  "Hepatitis",
];

export const GENDER: Gender[] = ["FEMALE", "MALE", "OTHER"];

export const BLOODGROUP = [
  {
    name: "A-",
    value: "A_NEG",
  },
  {
    name: "A+",
    value: "A_POS",
  },
  {
    name: "B+",
    value: "B_POS",
  },
  {
    name: "B-",
    value: "B_NEG",
  },
  {
    name: "AB+",
    value: "AB_POS",
  },
  {
    name: "AB-",
    value: "AB_NEG",
  },
  {
    name: "O-",
    value: "O_NEG",
  },
  {
    name: "O+",
    value: "O_POS",
  },
];

export const GENOTYPE: GenotypeProps[] = ["AA", "AC", "AS", "SC", "SS"];

export const MARITAL_STATUS: MaritalStatus[] = [
  "DIVORCED",
  "MARRIED",
  "SINGLE",
  "WIDOWED",
];

export const USER_ROLES = [
  {
    value: "ADMIN",
    label: "Administrator",
    description: "Full system access and user management",
    color: "bg-red-100 text-red-800",
    permissions: [
      "All system functions",
      "User management",
      "System settings",
      "Reports",
    ],
  },
  {
    value: "DOCTOR",
    label: "Doctor",
    description: "Clinical access and patient treatment",
    color: "bg-blue-100 text-blue-800",
    permissions: [
      "Patient records",
      "Clinical notes",
      "Appointments",
      "Treatment planning",
    ],
  },
  {
    value: "FRONTDESK",
    label: "Front Desk",
    description: "Patient management and scheduling",
    color: "bg-green-100 text-green-800",
    permissions: [
      "Patient registration",
      "Appointment scheduling",
      "Basic patient info",
    ],
  },
  {
    value: "NURSE",
    label: "Nurse",
    description: "Limited access to support dentists",
    color: "bg-yellow-100 text-yellow-800",
    permissions: [
      "View appointments",
      "Basic patient info",
      "Assist with procedures",
    ],
  },
];
