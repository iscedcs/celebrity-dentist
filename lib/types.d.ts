import {
  Appointment,
  BloodGroup,
  Gender,
  Patient,
  PatientStatus,
  Role,
  User,
} from "@prisma/client";

export interface IAuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextValue {
  user: Session["user"] | undefined;
  isLoggedIn: boolean;
  error?: string;
}

export type DecodedToken = {
  exp: number;
  iat: number;
  sub: string;
  email: string;
  role: string;
};

export interface DetailedAppointment extends Appointment {
  patient: Patient;
  doctor: User;
}

export interface UserProps {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  specialization?: string;
  isActive: boolean;
  emailVerified?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface FetchUserProps {
  page: number;
  limit: number;
  role?: string | string[] | undefined;
  query?: string | string[] | undefined;
  fields: string[];
}

export type GenotypeProps = "AA" | "AS" | "SS" | "AC" | "SC";

export interface PatientProps {
  id: string | null;
  patientId: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  gender: Gender;
  dateOfBirth: Date | null;
  age: number | null;
  maritalStatus: string | null;
  occupation: string | null;
  religion: string | null;
  bloodGroup: BloodGroup | null;
  genotype: GenotypeProps | null;
  phone: string;
  alternatePhone: string | null;
  email: string;
  address: string;
  state: string | null;
  lga: string | null;
  country: string;
  emergencyName: string | null;
  emergencyPhone: string | null;
  emergencyRelation: string | null;
  allergies: string | null;
  chronicConditions: string | null;
  pastMedicalHistory: string | null;
  pastSurgicalHistory: string | null;
  currentMedications: string | null;
  immunizationRecords: string | null;
  familyHistory: string | null;
  registrationType: Role;
  registeredById: string | null;
  insuranceProvider: string | null;
  insuranceNumber: string | null;
  paymentMethod: string | null;
  primaryDoctorId: string | null;
  status: PatientStatus;
  createdAt: Date;
  updatedAt: Date;
  approvedAt: Date | null;
  deletedAt: Date | null;
  createdById: string | null;
  userId: string | null;
}
