"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  FileText,
  Edit,
  Activity,
  ChevronLeft,
} from "lucide-react";

interface PatientDetailViewProps {
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    dateOfBirth: string;
    gender?: string;
    address?: string;
    emergencyContact?: string;
    allergies?: string;
    medications?: string;
    medicalConditions?: string;
    dentalHistory?: string;
    medicalChecklist: string[];
    notes?: string;
    status: string;
    createdAt: string;
    lastVisit?: string;
  };
  userRole: string;
  onBack?: () => void;
}

export function PatientDetailView({
  patient,
  userRole,
  onBack,
}: PatientDetailViewProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateShort = (dateString?: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800 text-xs">Inactive</Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

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
  ];

  // Sample clinical notes (in real app, fetch from API)
  const sampleClinicalNotes = [
    {
      id: "CN-001",
      date: "2024-01-15",
      type: "Consultation",
      dentist: "Dr. Michael Chen",
      diagnosis: "Dental caries",
      treatment:
        "Clinical examination completed. Recommended filling for tooth #3.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header with Back Button */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 md:hidden">
        <div className="flex items-center space-x-3">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-1 h-8 w-8"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-sm text-gray-500">{patient.id}</p>
          </div>
          {getStatusBadge(patient.status)}
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6">
        <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
          {/* Patient Header - Hidden on mobile, shown on desktop */}
          <Card className="border-blue-100 shadow-sm hidden md:block">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col space-y-4">
                {/* Top row with avatar and basic info */}
                <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <Avatar className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto sm:mx-0 flex-shrink-0">
                    <AvatarImage
                      src="/placeholder.svg?height=96&width=96"
                      alt={`${patient.firstName} ${patient.lastName}`}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-lg sm:text-xl lg:text-2xl">
                      {getInitials(patient.firstName, patient.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </h1>
                        {getStatusBadge(patient.status)}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 lg:space-x-6 space-y-1 sm:space-y-0 text-xs sm:text-sm text-gray-600">
                      <span className="font-medium">{patient.id}</span>
                      <span>Age: {calculateAge(patient.dateOfBirth)}</span>
                      <span className="hidden lg:inline">
                        Registered: {formatDate(patient.createdAt)}
                      </span>
                      <span className="lg:hidden">
                        Reg: {formatDateShort(patient.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Action buttons */}
                {(userRole === "admin" || userRole === "receptionist") && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <div className="flex space-x-2 sm:ml-auto">
                      <Button
                        variant="outline"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent flex-1 sm:flex-none"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        <span className="hidden lg:inline">Edit Patient</span>
                        <span className="lg:hidden">Edit</span>
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="hidden lg:inline">
                          Schedule Appointment
                        </span>
                        <span className="lg:hidden">Schedule</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mobile Patient Summary Card */}
          <Card className="border-blue-100 shadow-sm md:hidden">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-16 h-16 flex-shrink-0">
                  <AvatarImage
                    src="/placeholder.svg?height=64&width=64"
                    alt={`${patient.firstName} ${patient.lastName}`}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                    {getInitials(patient.firstName, patient.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">
                      Age {calculateAge(patient.dateOfBirth)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="block">Phone</span>
                      <span className="font-medium text-gray-900">
                        {patient.phone}
                      </span>
                    </div>
                    <div>
                      <span className="block">Registered</span>
                      <span className="font-medium text-gray-900">
                        {formatDateShort(patient.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Action Buttons */}
              {(userRole === "admin" || userRole === "receptionist") && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Patient Details Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            {/* Mobile: Scrollable tabs */}
            <div className="md:hidden">
              <ScrollArea className="w-full">
                <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-max min-w-full">
                  <TabsTrigger
                    value="overview"
                    className="px-4 py-2 text-sm whitespace-nowrap"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="medical"
                    className="px-4 py-2 text-sm whitespace-nowrap"
                  >
                    Medical
                  </TabsTrigger>
                  <TabsTrigger
                    value="appointments"
                    className="px-4 py-2 text-sm whitespace-nowrap"
                  >
                    Appointments
                  </TabsTrigger>
                  <TabsTrigger
                    value="clinical"
                    className="px-4 py-2 text-sm whitespace-nowrap"
                  >
                    Clinical
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="px-4 py-2 text-sm whitespace-nowrap"
                  >
                    History
                  </TabsTrigger>
                </TabsList>
              </ScrollArea>
            </div>

            {/* Desktop: Regular tabs */}
            <div className="hidden md:block">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="medical">Medical</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="clinical">Clinical Notes</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Contact Information */}
                <Card className="border-blue-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg text-blue-900 flex items-center">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-1 gap-4">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-600">Phone</p>
                          <p className="font-medium text-sm truncate">
                            {patient.phone}
                          </p>
                        </div>
                      </div>
                      {patient.email && (
                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-600">Email</p>
                            <p className="font-medium text-sm truncate">
                              {patient.email}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {patient.address && (
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-600">Address</p>
                          <p className="font-medium text-sm leading-relaxed">
                            {patient.address}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-1 gap-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-600">Date of Birth</p>
                          <p className="font-medium text-sm">
                            {formatDate(patient.dateOfBirth)}
                          </p>
                        </div>
                      </div>
                      {patient.gender && (
                        <div className="flex items-center space-x-3">
                          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-600">Gender</p>
                            <p className="font-medium text-sm capitalize">
                              {patient.gender}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card className="border-blue-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg text-blue-900 flex items-center">
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                      Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.emergencyContact ? (
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="font-medium text-sm">
                          {patient.emergencyContact}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">
                        No emergency contact specified
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="border-blue-100 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg text-blue-900 flex items-center">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">Last Visit</p>
                        <p className="text-xs text-gray-600">
                          {formatDate(patient.lastVisit)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">
                          Patient Registered
                        </p>
                        <p className="text-xs text-gray-600">
                          {formatDate(patient.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medical Tab */}
            <TabsContent value="medical" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Allergies */}
                <Card className="border-blue-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg text-blue-900">
                      Allergies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.allergies ? (
                      <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                        <p className="text-sm text-red-800">
                          {patient.allergies}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">
                        No known allergies
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Current Medications */}
                <Card className="border-blue-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg text-blue-900">
                      Current Medications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.medications ? (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm">{patient.medications}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">
                        No current medications
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Medical Conditions */}
                <Card className="border-blue-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg text-blue-900">
                      Medical Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.medicalConditions ? (
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm">{patient.medicalConditions}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">
                        No medical conditions reported
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Medical Checklist */}
                <Card className="border-blue-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg text-blue-900">
                      Medical History Checklist
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.medicalChecklist &&
                    patient.medicalChecklist.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {patient.medicalChecklist.map((condition) => (
                          <Badge
                            key={condition}
                            variant="outline"
                            className="text-red-600 border-red-200 text-xs"
                          >
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">
                        No conditions checked
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Dental History */}
              <Card className="border-blue-100 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg text-blue-900">
                    Dental History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.dentalHistory ? (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm">{patient.dentalHistory}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm">
                      No dental history recorded
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="space-y-4">
              <Card className="border-blue-100 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg text-blue-900">
                    Appointment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sampleAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {sampleAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex flex-col space-y-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1 min-w-0">
                              <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm">
                                  {appointment.type}
                                </p>
                                <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-2 space-y-1 xs:space-y-0 text-xs text-gray-600">
                                  <span>
                                    {formatDateShort(appointment.date)} at{" "}
                                    {appointment.time}
                                  </span>
                                  <span className="hidden xs:inline">•</span>
                                  <span>{appointment.dentist}</span>
                                </div>
                              </div>
                            </div>
                            <Badge
                              className={`text-xs flex-shrink-0 ${
                                appointment.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : appointment.status === "scheduled"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-base font-medium mb-2">
                        No appointments yet
                      </p>
                      <p className="text-sm">
                        Schedule the first appointment for this patient
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Clinical Notes Tab */}
            <TabsContent value="clinical" className="space-y-4">
              <Card className="border-blue-100 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg text-blue-900">
                    Clinical Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sampleClinicalNotes.length > 0 ? (
                    <div className="space-y-4">
                      {sampleClinicalNotes.map((note) => (
                        <div
                          key={note.id}
                          className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-purple-600 flex-shrink-0" />
                              <span className="font-medium text-sm">
                                {note.type}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatDate(note.date)}
                            </span>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div className="p-3 bg-red-50 rounded-lg">
                              <p className="font-medium text-red-800 mb-1">
                                Diagnosis:
                              </p>
                              <p className="text-red-700">{note.diagnosis}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="font-medium text-blue-800 mb-1">
                                Treatment:
                              </p>
                              <p className="text-blue-700">{note.treatment}</p>
                            </div>
                            <p className="text-xs text-gray-600 pt-2 border-t">
                              <strong>Provider:</strong> {note.dentist}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-base font-medium mb-2">
                        No clinical notes yet
                      </p>
                      <p className="text-sm">
                        Clinical notes will appear here after treatments
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-4">
              <Card className="border-blue-100 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg text-blue-900">
                    Patient Notes & History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.notes ? (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm leading-relaxed">{patient.notes}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm">
                      No additional notes recorded
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-blue-100 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg text-blue-900">
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">
                          Patient registered
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(patient.createdAt)}
                        </p>
                      </div>
                    </div>
                    {patient.lastVisit && (
                      <div className="flex items-start space-x-3">
                        <div className="w-3 h-3 bg-green-600 rounded-full flex-shrink-0 mt-1"></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">Last visit</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(patient.lastVisit)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
