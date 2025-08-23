import { Appointment, Patient, User } from '@prisma/client';

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

export interface DetailedAppointment extends Appointment {
    patient: Patient;
    doctor: User;
}
