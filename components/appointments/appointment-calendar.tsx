'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
    getAppointmentsAction,
    updateAppointmentStatusAction,
    getMyAppointments,
} from '@/actions/appointment';
import { Appointment } from '@prisma/client';
import Link from 'next/link';

interface AppointmentCalendarProps {
    userRole: string;
}

export function AppointmentCalendar({ userRole }: AppointmentCalendarProps) {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userRole.toLowerCase() === 'patient') {
            loadMyAppointments();
        } else {
            loadAppointments();
        }
    }, [selectedDate, userRole]);

    const loadAppointments = async () => {
        setLoading(true);
        try {
            const result = await getAppointmentsAction({ date: selectedDate });
            if (result.data) {
                setAppointments(result.data || []);
            } else {
                toast.error('Failed to load appointments');
            }
        } catch (error) {
            toast.error('Error loading appointments');
        } finally {
            setLoading(false);
        }
    };

    const loadMyAppointments = async () => {
        setLoading(true);
        try {
            const result = await getMyAppointments();
            if (result.data) {
                setAppointments(result.data || []);
            } else {
                toast.error('Failed to load your appointments');
            }
        } catch (error) {
            toast.error('Error loading your appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (
        appointmentId: string,
        newStatus: string
    ) => {
        try {
            const result = await updateAppointmentStatusAction(
                appointmentId,
                newStatus
            );
            if (result.success) {
                toast.success(`Appointment ${newStatus}`);
                loadAppointments(); // only admins/doctors update
            } else {
                toast.error('Failed to update appointment');
            }
        } catch (error) {
            toast.error('Error updating appointment');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'scheduled':
                return (
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                        Scheduled
                    </Badge>
                );
            case 'completed':
                return (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                        Completed
                    </Badge>
                );
            case 'cancelled':
                return (
                    <Badge className="bg-red-100 text-red-800 text-xs">
                        Cancelled
                    </Badge>
                );
            case 'no-show':
                return (
                    <Badge className="bg-gray-100 text-gray-800 text-xs">
                        No Show
                    </Badge>
                );
            default:
                return (
                    <Badge variant="secondary" className="text-xs">
                        {status}
                    </Badge>
                );
        }
    };

    const getServiceColor = (service: string) => {
        const colors = {
            consultation: 'border-l-purple-500',
            checkup: 'border-l-green-500',
            treatment: 'border-l-yellow-500',
            surgery: 'border-l-red-500',
            followup: 'border-l-blue-500',
            emergency: 'border-l-orange-500',
        };
        const serviceKey =
            service?.toLowerCase().replace(/\s+/g, '') || 'consultation';
        return colors[serviceKey as keyof typeof colors] || 'border-l-gray-500';
    };

    // Generate slots only for non-patient roles
    const timeSlots: string[] = [];
    if (userRole.toLowerCase() !== 'patient') {
        for (let hour = 8; hour < 18; hour++) {
            timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
            timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
    }

    const getAppointmentForSlot = (time: string) => {
        return appointments.find((apt) => {
            const appointmentTime = new Date(apt.date).toLocaleTimeString(
                'en-US',
                {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                }
            );
            return appointmentTime === time;
        });
    };

    return (
        <Card className="border-blue-100 w-full">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    {userRole.toLowerCase() === 'patient'
                        ? 'My Appointments'
                        : 'Daily Schedule'}
                </CardTitle>
            </CardHeader>

            <CardContent className="px-3 sm:px-6">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600 text-sm sm:text-base">
                            Loading appointments...
                        </span>
                    </div>
                ) : userRole.toLowerCase() === 'patient' ? (
                    // Patient view: list of their appointments
                    appointments.length > 0 ? (
                        <div className="space-y-4">
                            {appointments.map((apt) => (
                                <Link
                                    key={apt.id}
                                    href={`/appointments/${apt.id}`}
                                >
                                    <div
                                        className={`p-3 rounded-lg border-l-4 shadow-sm hover:bg-gray-50 transition ${getServiceColor(
                                            apt.service
                                        )}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {apt.service}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(
                                                        apt.date
                                                    ).toLocaleString()}
                                                </p>
                                                {apt.reason && (
                                                    <p className="text-xs text-gray-500 italic mt-1">
                                                        {apt.reason}
                                                    </p>
                                                )}
                                            </div>
                                            {getStatusBadge(apt.status)}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Calendar className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-base sm:text-lg font-medium">
                                No appointments found
                            </p>
                        </div>
                    )
                ) : (
                    // Non-patient view: existing calendar layout
                    <div className="space-y-1 sm:space-y-2">
                        {timeSlots.map((time) => {
                            const appointment = getAppointmentForSlot(time);
                            return (
                                <div
                                    key={time}
                                    className="flex items-start min-h-[50px] sm:min-h-[60px] border-b border-gray-100 last:border-b-0 py-2"
                                >
                                    <div className="w-12 sm:w-16 text-xs sm:text-sm text-gray-500 font-medium pt-1 flex-shrink-0">
                                        {time}
                                    </div>
                                    <div className="flex-1 ml-2 sm:ml-4">
                                        {appointment ? (
                                            <div
                                                className={`p-2 sm:p-3 rounded-lg border-l-4 bg-white shadow-sm ${getServiceColor(
                                                    appointment.service
                                                )}`}
                                            >
                                                <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                                                            <span className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                                                {appointment.patientId ||
                                                                    `Patient ${appointment.patientId}`}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                                                            <span className="text-xs sm:text-sm text-gray-600">
                                                                {new Date(
                                                                    appointment.date
                                                                ).toLocaleTimeString(
                                                                    'en-US',
                                                                    {
                                                                        hour: 'numeric',
                                                                        minute: '2-digit',
                                                                        hour12: true,
                                                                    }
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs sm:text-sm text-gray-600 mb-2">
                                                            <strong className="text-gray-800">
                                                                {
                                                                    appointment.service
                                                                }
                                                            </strong>
                                                            {appointment.reason && (
                                                                <div className="sm:inline sm:ml-1 text-gray-600 italic">
                                                                    {
                                                                        appointment.reason
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-row sm:flex-col items-start sm:items-end space-x-2 sm:space-x-0 sm:space-y-2">
                                                        {getStatusBadge(
                                                            appointment.status
                                                        )}
                                                        {appointment.status.toLowerCase() ===
                                                            'scheduled' && (
                                                            <div className="flex space-x-1">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() =>
                                                                        handleStatusUpdate(
                                                                            appointment.id,
                                                                            'completed'
                                                                        )
                                                                    }
                                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 h-7 w-7 p-0 sm:h-8 sm:w-8"
                                                                >
                                                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() =>
                                                                        handleStatusUpdate(
                                                                            appointment.id,
                                                                            'cancelled'
                                                                        )
                                                                    }
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0 sm:h-8 sm:w-8"
                                                                >
                                                                    <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-xs sm:text-sm text-gray-400 italic pt-1">
                                                Available
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
