import { Calendar, Clock, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { getMyAppointments } from '@/actions/appointment';

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function formatTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

function getStatusColor(status: string) {
    switch (status) {
        case 'PENDING':
            return 'bg-yellow-100 text-yellow-800';
        case 'CONFIRMED':
            return 'bg-blue-100 text-blue-800';
        case 'COMPLETED':
            return 'bg-green-100 text-green-800';
        case 'CANCELLED':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

export async function AppointmentsWidget() {
    const result = await getMyAppointments();

    if (!result.success || !result.data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        My Appointments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500">
                        {result.error || 'Unable to load appointments'}
                    </p>
                </CardContent>
            </Card>
        );
    }

    const appointments = result.data;
    const sortedAppointments = appointments.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const latestAppointment = sortedAppointments[0];
    const otherAppointmentsCount = appointments.length - 1;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    My Appointments
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {latestAppointment ? (
                    <>
                        {/* Latest Appointment */}
                        <div className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-medium text-sm">
                                        {latestAppointment.service}
                                    </h4>
                                    <p className="text-xs text-gray-600">
                                        {latestAppointment.reason}
                                    </p>
                                </div>
                                <Badge
                                    className={`text-xs ${getStatusColor(
                                        latestAppointment.status
                                    )}`}
                                >
                                    {latestAppointment.status}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(new Date(latestAppointment.date).toString())}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatTime(new Date(latestAppointment.date).toString())}
                                </div>
                            </div>
                        </div>

                        {/* Other Appointments Count */}
                        {otherAppointmentsCount > 0 && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                    {otherAppointmentsCount} other appointment
                                    {otherAppointmentsCount !== 1 ? 's' : ''}
                                </span>
                            </div>
                        )}

                        {/* View All Link */}
                        <Link href="/appointments" className="block">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full bg-transparent"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                View All Appointments
                            </Button>
                        </Link>
                    </>
                ) : (
                    <div className="text-center py-6">
                        <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-sm text-gray-500 mb-4">
                            No appointments scheduled
                        </p>
                        <Link href="/appointments">
                            <Button variant="outline" size="sm">
                                Schedule Appointment
                            </Button>
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
