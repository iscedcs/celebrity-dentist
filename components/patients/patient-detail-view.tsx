"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Phone, Mail, MapPin, Calendar, AlertTriangle, FileText, Edit, Activity } from "lucide-react"

interface PatientDetailViewProps {
  patient: {
    id: string
    firstName: string
    lastName: string
    email?: string
    phone: string
    dateOfBirth: string
    gender?: string
    address?: string
    emergencyContact?: string
    allergies?: string
    medications?: string
    medicalConditions?: string
    dentalHistory?: string
    medicalChecklist: string[]
    notes?: string
    status: string
    createdAt: string
    lastVisit?: string
  }
  userRole: string
}

export function PatientDetailView({ patient, userRole }: PatientDetailViewProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  // Sample appointments data (in real app, fetch from API)
  const sampleAppointments = [
    {
      id: "APT-001",
      date: "2024-01-29",
      time: "09:00",
      type: "Consultation",
      dentist: "Dr. Michael Chen",
      status: "scheduled",
    },
    {
      id: "APT-002",
      date: "2024-01-15",
      time: "14:00",
      type: "Cleaning",
      dentist: "Dr. Michael Chen",
      status: "completed",
    },
  ]

  // Sample clinical notes (in real app, fetch from API)
  const sampleClinicalNotes = [
    {
      id: "CN-001",
      date: "2024-01-15",
      type: "Consultation",
      dentist: "Dr. Michael Chen",
      diagnosis: "Dental caries",
      treatment: "Clinical examination completed. Recommended filling for tooth #3.",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <Card className="border-blue-100">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/placeholder-user.jpg" alt={`${patient.firstName} ${patient.lastName}`} />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                  {getInitials(patient.firstName, patient.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </h1>
                  {getStatusBadge(patient.status)}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-1 sm:space-y-0 text-sm text-gray-600">
                  <span className="font-medium">{patient.id}</span>
                  <span>Age: {calculateAge(patient.dateOfBirth)}</span>
                  <span>Registered: {formatDate(patient.createdAt)}</span>
                </div>
              </div>
            </div>

            {(userRole === "admin" || userRole === "receptionist") && (
              <div className="flex space-x-2">
                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Patient
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Patient Details Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="clinical">Clinical Notes</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{patient.phone}</p>
                  </div>
                </div>

                {patient.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{patient.email}</p>
                    </div>
                  </div>
                )}

                {patient.address && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">{patient.address}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium">{formatDate(patient.dateOfBirth)}</p>
                  </div>
                </div>

                {patient.gender && (
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Gender</p>
                      <p className="font-medium capitalize">{patient.gender}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patient.emergencyContact ? (
                  <p className="font-medium">{patient.emergencyContact}</p>
                ) : (
                  <p className="text-gray-500 italic">No emergency contact specified</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Last Visit</p>
                    <p className="text-xs text-gray-600">{formatDate(patient.lastVisit)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <FileText className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Patient Registered</p>
                    <p className="text-xs text-gray-600">{formatDate(patient.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical Tab */}
        <TabsContent value="medical" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Allergies */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">Allergies</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.allergies ? (
                  <p>{patient.allergies}</p>
                ) : (
                  <p className="text-gray-500 italic">No known allergies</p>
                )}
              </CardContent>
            </Card>

            {/* Current Medications */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">Current Medications</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.medications ? (
                  <p>{patient.medications}</p>
                ) : (
                  <p className="text-gray-500 italic">No current medications</p>
                )}
              </CardContent>
            </Card>

            {/* Medical Conditions */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">Medical Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.medicalConditions ? (
                  <p>{patient.medicalConditions}</p>
                ) : (
                  <p className="text-gray-500 italic">No medical conditions reported</p>
                )}
              </CardContent>
            </Card>

            {/* Medical Checklist */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">Medical History Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.medicalChecklist && patient.medicalChecklist.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {patient.medicalChecklist.map((condition) => (
                      <Badge key={condition} variant="outline" className="text-red-600 border-red-200">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No conditions checked</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Dental History */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">Dental History</CardTitle>
            </CardHeader>
            <CardContent>
              {patient.dentalHistory ? (
                <p>{patient.dentalHistory}</p>
              ) : (
                <p className="text-gray-500 italic">No dental history recorded</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">Appointment History</CardTitle>
            </CardHeader>
            <CardContent>
              {sampleAppointments.length > 0 ? (
                <div className="space-y-4">
                  {sampleAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{appointment.type}</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(appointment.date)} at {appointment.time}
                          </p>
                          <p className="text-sm text-gray-500">with {appointment.dentist}</p>
                        </div>
                      </div>
                      <Badge
                        className={
                          appointment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "scheduled"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No appointments yet</p>
                  <p className="text-sm">Schedule the first appointment for this patient</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clinical Notes Tab */}
        <TabsContent value="clinical" className="space-y-4">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">Clinical Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {sampleClinicalNotes.length > 0 ? (
                <div className="space-y-4">
                  {sampleClinicalNotes.map((note) => (
                    <div key={note.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-purple-600" />
                          <span className="font-medium">{note.type}</span>
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(note.date)}</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <strong>Diagnosis:</strong> {note.diagnosis}
                        </p>
                        <p className="text-sm">
                          <strong>Treatment:</strong> {note.treatment}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Provider:</strong> {note.dentist}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No clinical notes yet</p>
                  <p className="text-sm">Clinical notes will appear here after treatments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">Patient Notes & History</CardTitle>
            </CardHeader>
            <CardContent>
              {patient.notes ? (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p>{patient.notes}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic">No additional notes recorded</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Patient registered</p>
                    <p className="text-xs text-gray-500">{formatDate(patient.createdAt)}</p>
                  </div>
                </div>
                {patient.lastVisit && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Last visit</p>
                      <p className="text-xs text-gray-500">{formatDate(patient.lastVisit)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
