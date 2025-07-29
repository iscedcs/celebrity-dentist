"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Clock, User, CheckCircle, XCircle } from "lucide-react"
import { getAppointmentsAction, updateAppointmentStatusAction } from "@/app/actions/appointments"
import { toast } from "sonner"

interface AppointmentCalendarProps {
  userRole: string
}

interface Appointment {
  id: string
  patientId: string
  patientName: string
  dentistId: string
  dentistName: string
  type: string
  typeName: string
  date: string
  startTime: string
  endTime: string
  duration: number
  status: string
  notes: string
}

export function AppointmentCalendar({ userRole }: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAppointments()
  }, [selectedDate])

  const loadAppointments = async () => {
    setLoading(true)
    try {
      const result = await getAppointmentsAction(selectedDate)
      if (result.success) {
        setAppointments(result.appointments || [])
      } else {
        toast.error("Failed to load appointments")
      }
    } catch (error) {
      toast.error("Error loading appointments")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      const result = await updateAppointmentStatusAction(appointmentId, newStatus)
      if (result.success) {
        toast.success(`Appointment ${newStatus}`)
        loadAppointments() // Reload appointments
      } else {
        toast.error("Failed to update appointment")
      }
    } catch (error) {
      toast.error("Error updating appointment")
    }
  }

  const navigateDate = (direction: "prev" | "next") => {
    const currentDate = new Date(selectedDate)
    if (direction === "prev") {
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      currentDate.setDate(currentDate.getDate() + 1)
    }
    setSelectedDate(currentDate.toISOString().split("T")[0])
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      case "no-show":
        return <Badge className="bg-gray-100 text-gray-800">No Show</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeColor = (type: string) => {
    const colors = {
      consultation: "border-l-purple-500",
      cleaning: "border-l-green-500",
      filling: "border-l-yellow-500",
      crown: "border-l-blue-500",
      "root-canal": "border-l-red-500",
      extraction: "border-l-orange-500",
      checkup: "border-l-gray-500",
    }
    return colors[type as keyof typeof colors] || "border-l-gray-500"
  }

  // Generate time slots for the day
  const timeSlots = []
  for (let hour = 8; hour < 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, "0")}:00`)
    timeSlots.push(`${hour.toString().padStart(2, "0")}:30`)
  }

  const getAppointmentForSlot = (time: string) => {
    return appointments.find((apt) => apt.startTime === time)
  }

  return (
    <Card className="border-blue-100">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Daily Schedule
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-sm font-medium text-gray-900 min-w-[120px] text-center">
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1 border border-blue-200 rounded-md text-sm focus:border-blue-400 focus:outline-none"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading appointments...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {timeSlots.map((time) => {
              const appointment = getAppointmentForSlot(time)
              return (
                <div key={time} className="flex items-center min-h-[60px] border-b border-gray-100 last:border-b-0">
                  <div className="w-16 text-sm text-gray-500 font-medium">{time}</div>
                  <div className="flex-1 ml-4">
                    {appointment ? (
                      <div className={`p-3 rounded-lg border-l-4 bg-white shadow-sm ${getTypeColor(appointment.type)}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-gray-900">{appointment.patientName}</span>
                              <span className="text-sm text-gray-500">({appointment.patientId})</span>
                            </div>
                            <div className="flex items-center space-x-2 mb-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {appointment.startTime} - {appointment.endTime} ({appointment.duration} min)
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              <strong>{appointment.typeName}</strong> with {appointment.dentistName}
                            </div>
                            {appointment.notes && (
                              <div className="text-sm text-gray-500 italic">{appointment.notes}</div>
                            )}
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            {getStatusBadge(appointment.status)}
                            {appointment.status === "scheduled" && (
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusUpdate(appointment.id, "completed")}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <XCircle className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400 italic">Available</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && appointments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No appointments scheduled</p>
            <p className="text-sm">This day is completely free</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
