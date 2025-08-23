import { notFound, redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Calendar,
    Clock,
    User,
    Phone,
    Mail,
    MapPin,
    FileText,
    Stethoscope,
} from 'lucide-react';
import { format } from 'date-fns';
import { getCurrentUser } from '@/actions/auth';
import { getAppointmentByIdAction } from '@/actions/appointment';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AppointmentDetailPage({ params }: PageProps) {
    const { id } = await params;
    const userResult = await getCurrentUser();

    if (!userResult) {
        redirect('/sign-in');
    }

    const user = userResult;
    const appointmentResult = await getAppointmentByIdAction(id);

    if (!appointmentResult.success || !appointmentResult.data) {
        notFound();
    }

    const appointment = appointmentResult.data;
    const isPatient = user.role === 'PATIENT';
    const canManageAppointment = [
        'ADMIN',
        'SUPERADMIN',
        'DOCTOR',
        'NURSE',
        'FRONTDESK',
    ].includes(user.role);

    // Patient can only view their own appointments
    if (isPatient && appointment.patient.userId !== user.id) {
        notFound();
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'COMPLETED':
                return 'bg-blue-100 text-blue-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader user={user} />

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-2">
                        Appointment Details
                    </h1>
                    <p className="text-muted-foreground">
                        {isPatient
                            ? 'Your appointment information'
                            : 'Patient appointment information'}
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Appointment Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Appointment Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    Status
                                </span>
                                <Badge
                                    className={getStatusColor(
                                        appointment.status
                                    )}
                                >
                                    {appointment.status}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">
                                    {format(
                                        new Date(appointment.date),
                                        'EEEE, MMMM d, yyyy'
                                    )}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">
                                    {format(
                                        new Date(appointment.date),
                                        'h:mm a'
                                    )}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Stethoscope className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                    Service:
                                </span>
                                <span className="text-sm">
                                    {appointment.service}
                                </span>
                            </div>

                            {appointment.reason && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">
                                            Reason:
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground pl-6">
                                        {appointment.reason}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Patient Information - Show for non-patients or if patient viewing own */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                {isPatient
                                    ? 'Your Information'
                                    : 'Patient Information'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="font-medium">
                                    {appointment.patient.firstName}{' '}
                                    {appointment.patient.lastName}
                                    {appointment.patient.middleName &&
                                        ` ${appointment.patient.middleName}`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Patient ID: {appointment.patient.patientId}
                                </p>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {appointment.patient.phone}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {appointment.patient.email}
                                    </span>
                                </div>

                                {appointment.patient.address && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            {appointment.patient.address}
                                            {appointment.patient.state &&
                                                `, ${appointment.patient.state}`}
                                            {appointment.patient.country &&
                                                `, ${appointment.patient.country}`}
                                        </span>
                                    </div>
                                )}

                                {appointment.patient.dateOfBirth && (
                                    <div className="text-sm">
                                        <span className="font-medium">
                                            Date of Birth:{' '}
                                        </span>
                                        {format(
                                            new Date(
                                                appointment.patient.dateOfBirth
                                            ),
                                            'MMMM d, yyyy'
                                        )}
                                        {appointment.patient.age &&
                                            ` (${appointment.patient.age} years old)`}
                                    </div>
                                )}

                                {appointment.patient.gender && (
                                    <div className="text-sm">
                                        <span className="font-medium">
                                            Gender:{' '}
                                        </span>
                                        {appointment.patient.gender}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Doctor Information - Show if doctor is assigned */}
                    {appointment.doctor && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Stethoscope className="w-5 h-5" />
                                    Doctor Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <p className="font-medium">
                                        Dr. {appointment.doctor.firstName}{' '}
                                        {appointment.doctor.lastName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {appointment.doctor.specialization ||
                                            'N/A'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Administrative Actions - Only for non-patient roles */}
                    {canManageAppointment && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {appointment.status === 'PENDING' && (
                                    <Button
                                        className="w-full"
                                        variant="default"
                                    >
                                        Confirm Appointment
                                    </Button>
                                )}

                                {appointment.status === 'CONFIRMED' && (
                                    <Button
                                        className="w-full"
                                        variant="default"
                                    >
                                        Mark as Completed
                                    </Button>
                                )}

                                {['PENDING', 'CONFIRMED'].includes(
                                    appointment.status
                                ) && (
                                    <Button
                                        className="w-full"
                                        variant="destructive"
                                    >
                                        Cancel Appointment
                                    </Button>
                                )}

                                <Button
                                    className="w-full bg-transparent"
                                    variant="outline"
                                >
                                    Edit Appointment
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Appointment History/Timeline - Show for non-patients */}
                {!isPatient && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Appointment Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <div className="text-sm">
                                        <span className="font-medium">
                                            Created:
                                        </span>{' '}
                                        {format(
                                            new Date(appointment.createdAt),
                                            "MMM d, yyyy 'at' h:mm a"
                                        )}
                                    </div>
                                </div>

                                {appointment.updatedAt !==
                                    appointment.createdAt && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <div className="text-sm">
                                            <span className="font-medium">
                                                Last Updated:
                                            </span>{' '}
                                            {format(
                                                new Date(appointment.updatedAt),
                                                "MMM d, yyyy 'at' h:mm a"
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}
