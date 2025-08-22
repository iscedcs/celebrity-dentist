"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";
// import {
//   getAppointmentsAction,
//   updateAppointmentStatusAction,
// } from "@/app/actions/appointments";
import { toast } from "sonner";

interface AppointmentCalendarProps {
  userRole: string;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  dentistId: string;
  dentistName: string;
  type: string;
  typeName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: string;
  notes: string;
}

export function AppointmentCalendar({ userRole }: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  const loadAppointments = async () => {
    setLoading(true);
    // try {
    //   const result = await getAppointmentsAction(selectedDate);
    //   if (result.success) {
    //     setAppointments(result.appointments || []);
    //   } else {
    //     toast.error("Failed to load appointments");
    //   }
    // } catch (error) {
    //   toast.error("Error loading appointments");
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleStatusUpdate = async (
    appointmentId: string,
    newStatus: string
  ) => {
    // try {
    //   const result = await updateAppointmentStatusAction(
    //     appointmentId,
    //     newStatus
    //   );
    //   if (result.success) {
    //     toast.success(`Appointment ${newStatus}`);
    //     loadAppointments(); // Reload appointments
    //   } else {
    //     toast.error("Failed to update appointment");
    //   }
    // } catch (error) {
    //   toast.error("Error updating appointment");
    // }
  };

  const navigateDate = (direction: "prev" | "next") => {
    const currentDate = new Date(selectedDate);
    if (direction === "prev") {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setSelectedDate(currentDate.toISOString().split("T")[0]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 text-xs">Scheduled</Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 text-xs">Cancelled</Badge>
        );
      case "no-show":
        return (
          <Badge className="bg-gray-100 text-gray-800 text-xs">No Show</Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      consultation: "border-l-purple-500",
      cleaning: "border-l-green-500",
      filling: "border-l-yellow-500",
      crown: "border-l-blue-500",
      "root-canal": "border-l-red-500",
      extraction: "border-l-orange-500",
      checkup: "border-l-gray-500",
    };
    return colors[type as keyof typeof colors] || "border-l-gray-500";
  };

  // Generate time slots for the day
  const timeSlots = [];
  for (let hour = 8; hour < 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    timeSlots.push(`${hour.toString().padStart(2, "0")}:30`);
  }

  const getAppointmentForSlot = (time: string) => {
    return appointments.find((apt) => apt.startTime === time);
  };

  return (
    <Card className="border-blue-100 w-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Daily Schedule
          </CardTitle>

          {/* Mobile-first navigation */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            {/* Date navigation */}
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("prev")}
                className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Prev</span>
              </Button>

              <div className="text-sm sm:text-base font-medium text-gray-900 min-w-[140px] sm:min-w-[160px] text-center px-2">
                <div className="sm:hidden">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="hidden sm:block">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("next")}
                className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
              >
                <ChevronRight className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Next</span>
              </Button>
            </div>

            {/* Date picker */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border border-blue-200 rounded-md text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-3 sm:px-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 text-sm sm:text-base">
              Loading appointments...
            </span>
          </div>
        ) : (
          <div className="space-y-1 sm:space-y-2">
            {timeSlots.map((time) => {
              const appointment = getAppointmentForSlot(time);
              return (
                <div
                  key={time}
                  className="flex items-start min-h-[50px] sm:min-h-[60px] border-b border-gray-100 last:border-b-0 py-2"
                >
                  {/* Time slot */}
                  <div className="w-12 sm:w-16 text-xs sm:text-sm text-gray-500 font-medium pt-1 flex-shrink-0">
                    {time}
                  </div>

                  {/* Appointment content */}
                  <div className="flex-1 ml-2 sm:ml-4">
                    {appointment ? (
                      <div
                        className={`p-2 sm:p-3 rounded-lg border-l-4 bg-white shadow-sm ${getTypeColor(
                          appointment.type
                        )}`}
                      >
                        <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
                          <div className="flex-1 min-w-0">
                            {/* Patient info */}
                            <div className="flex items-center space-x-2 mb-1">
                              <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                              <span className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                {appointment.patientName}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">
                                ({appointment.patientId})
                              </span>
                            </div>

                            {/* Time and duration */}
                            <div className="flex items-center space-x-2 mb-1">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                              <span className="text-xs sm:text-sm text-gray-600">
                                {appointment.startTime} - {appointment.endTime}
                                <span className="hidden sm:inline">
                                  {" "}
                                  ({appointment.duration} min)
                                </span>
                              </span>
                            </div>

                            {/* Type and dentist */}
                            <div className="text-xs sm:text-sm text-gray-600 mb-2">
                              <strong className="text-gray-800">
                                {appointment.typeName}
                              </strong>
                              <div className="sm:inline sm:ml-1">
                                <span className="hidden sm:inline">with </span>
                                <span className="block sm:inline text-gray-600">
                                  {appointment.dentistName}
                                </span>
                              </div>
                            </div>

                            {/* Notes */}
                            {appointment.notes && (
                              <div className="text-xs sm:text-sm text-gray-500 italic line-clamp-2">
                                {appointment.notes}
                              </div>
                            )}
                          </div>

                          {/* Status and actions */}
                          <div className="flex flex-row sm:flex-col items-start sm:items-end space-x-2 sm:space-x-0 sm:space-y-2">
                            {getStatusBadge(appointment.status)}

                            {appointment.status === "scheduled" && (
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      appointment.id,
                                      "completed"
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
                                      "cancelled"
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

        {/* Empty state */}
        {!loading && appointments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-base sm:text-lg font-medium">
              No appointments scheduled
            </p>
            <p className="text-sm">This day is completely free</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
