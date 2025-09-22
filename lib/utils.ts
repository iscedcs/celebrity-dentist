import {
  AppointmentStatus,
  Patient,
  PatientStatus,
  Role,
} from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFullName = (patient: Patient) => {
  return `${patient.firstName} ${
    patient.middleName ? ` ${patient.middleName}` : ""
  } ${patient.lastName}`;
};

export const getInitials = (firstName: string, lastName: string) => {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};

export const formatEnumValue = (value?: string) => {
  if (!value) return "Not specified";
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export const formatDateShort = (dateString?: string) => {
  if (!dateString) return "Not specified";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return "Not specified";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const calculateAge = (dateOfBirth?: string) => {
  if (!dateOfBirth) return "N/A";
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  console.log({ dateOfBirth });
  return age;
};

export const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export function navigateDate(
  direction: "prev" | "next",
  currentDate: string
): string {
  const date = new Date(currentDate);
  if (direction === "prev") {
    date.setDate(date.getDate() - 1);
  } else {
    date.setDate(date.getDate() + 1);
  }
  return date.toISOString().split("T")[0];
}

export const getRoleBadgeColor = (role: Role) => {
  switch (role) {
    case "SUPERADMIN":
      return "bg-red-100 text-red-800";
    case "ADMIN":
      return "bg-red-100 text-red-800";
    case "DOCTOR":
      return "bg-blue-100 text-blue-800";
    case "FRONTDESK":
      return "bg-green-100 text-green-800";
    case "NURSE":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getActiveBadgeColor = (status: boolean) => {
  switch (status) {
    case true:
      return "bg-emerald-700/30 text-emerald-600";
    case false:
      return "bg-gray-600/20 text-gray-950";
    default:
      return "bg-emerald-700/30 text-emerald-600";
  }
};

export const getPatientStatusColor = (status: PatientStatus) => {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-700/30 text-emerald-600";
    case "INACTIVE":
      return "bg-gray-600/20 text-gray-950";
    case "ARCHIVED":
      return "bg-rose-700/20 text-rose-600";
    case "PENDING":
      return "bg-amber-500/20 text-amber-600";
    default:
      return "bg-emerald-700/30 text-emerald-600";
  }
};

export const getAppointmentStatusColor = (status: AppointmentStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-500/20 text-amber-600";
    case "CONFIRMED":
      return "bg-emerald-700/30 text-emerald-600";
    case "CANCELLED":
      return "bg-rose-700/20 text-rose-600";
    case "COMPLETED":
      return "bg-sky-600/20 text-sky-600";
    case "NO_SHOW":
      return "bg-gray-500/20 text-gray-600";
    default:
      return "bg-gray-500/20 text-gray-600";
  }
};
