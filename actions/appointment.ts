"use server";

import { auth } from '@/auth';
import { appointmentValues } from '@/components/homepage/contact-section';
import { API, URLS } from '@/lib/const';
import { DetailedAppointment } from '@/lib/types';
import { Appointment } from '@prisma/client';
import axios from 'axios';

export const bookAppointmentRequest = async (data: appointmentValues) => {
    const url = `${API}${URLS.appointment.public_booking}`;
    const dateTimeString = `${data.date}T${data.time}`;
    const isoDate = new Date(dateTimeString).toISOString();
    const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        date: isoDate,
        service: data.services,
        reason: data.reason,
    };
    console.log(url, payload);

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        //   console.log()

        const data = await res.json();
        console.log({ data });

        if (data.success) {
            return data.data;
        }
        return null;
    } catch (e: any) {
        console.log('Unable to create appointment', e);
    }
};

export async function getMyAppointments(): Promise<{
    success: boolean;
    data?: Appointment[];
    error?: string;
}> {
    try {
        const session = await auth();
        const token = session?.user.accessToken;

        if (!token) {
            return { success: false, error: 'Authentication required' };
        }

        const response = await axios.get(
            `${API}${URLS.appointment.private_me}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.success) {
            return { success: true, data: response.data.data };
        } else {
            return {
                success: false,
                error: response.data.message || 'Failed to fetch appointments',
            };
        }
    } catch (error) {
        console.error('Error fetching appointments:', error);
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    'Failed to fetch appointments',
            };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export async function getAppointmentsAction(params?: {
    date?: string;
}): Promise<{
    success: boolean;
    data?: Appointment[];
    error?: string;
}> {
    try {
        const session = await auth();
        const token = session?.user.accessToken;

        if (!token) {
            return { success: false, error: 'Authentication required' };
        }

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (params?.date) {
            queryParams.append('date', params.date);
        }

        const url = `${API}${URLS.appointment.all}${
            queryParams.toString() ? `?${queryParams.toString()}` : ''
        }`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.data.success) {
            return { success: true, data: response.data.data };
        } else {
            return {
                success: false,
                error: response.data.message || 'Failed to fetch appointments',
            };
        }
    } catch (error) {
        console.error('Error fetching appointments:', error);
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    'Failed to fetch appointments',
            };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export async function updateAppointmentStatusAction(
    appointmentId: string,
    status: string
): Promise<{ success: boolean; error?: string }> {
    const session = await auth();
    const token = session?.user.accessToken;

    if (!token) {
        return { success: false, error: 'Authentication required' };
    }

    try {
        const response = await axios.patch(
            `${API}${URLS.appointment.all}/${appointmentId}/status`,
            { status },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.success) {
            return { success: true };
        } else {
            return {
                success: false,
                error:
                    response.data.message ||
                    'Failed to update appointment status',
            };
        }
    } catch (error) {
        console.error('Error updating appointment status:', error);
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    'Failed to update appointment status',
            };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export async function getAppointmentByIdAction(appointmentId: string): Promise<{
    success: boolean;
    data?: DetailedAppointment;
    error?: string;
}> {
    try {
        const session = await auth();
        const token = session?.user.accessToken;

        if (!token) {
            return { success: false, error: 'Authentication required' };
        }

        const response = await axios.get(
            `${API}${URLS.appointment.one.replace('{id}', appointmentId)}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.success) {
            return { success: true, data: response.data.data };
        } else {
            return {
                success: false,
                error: response.data.message || 'Failed to fetch appointment',
            };
        }
    } catch (error) {
        console.error('Error fetching appointment:', error);
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    'Failed to fetch appointment',
            };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}