import { Appointment, Patient, User } from "@prisma/client";

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
