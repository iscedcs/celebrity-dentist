"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  Heart,
  Shield,
  CreditCard,
} from "lucide-react"
import { Patient, Visit } from "@prisma/client"
import { calculateAge, formatDate, formatDateShort, formatEnumValue, getFullName, getInitials } from "@/lib/utils"

export interface PatientWithVisits extends Patient {
  visits?: Visit[];
}

interface PatientDetailViewProps {
  patient: PatientWithVisits
  userRole: string
  onBack?: () => void
}

export function PatientDetailView({ patient, userRole, onBack }: PatientDetailViewProps) {
  const [activeTab, setActiveTab] = useState("overview")
  console.log(patient)







  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
      case "INACTIVE":
        return <Badge className="bg-gray-100 text-gray-800 text-xs">Inactive</Badge>
      case "SUSPENDED":
        return <Badge className="bg-red-100 text-red-800 text-xs">Suspended</Badge>
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            {status}
          </Badge>
        )
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header with Back Button */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 md:hidden">
        <div className="flex items-center space-x-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="p-1 h-8 w-8">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">{getFullName(patient)}</h1>
            <p className="text-sm text-gray-500">{patient.patientId}</p>
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
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt={getFullName(patient)} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-lg sm:text-xl lg:text-2xl">
                      {getInitials(patient.firstName, patient.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{getFullName(patient)}</h1>
                        {getStatusBadge(patient.status)}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 lg:space-x-6 space-y-1 sm:space-y-0 text-xs sm:text-sm text-gray-600">
                      <span className="font-medium">{patient.patientId}</span>
                      <span>Age: {calculateAge(patient.dateOfBirth?.toDateString())}</span>
                      {patient.bloodGroup && <span>Blood: {formatEnumValue(patient.bloodGroup)}</span>}
                      <span className="hidden lg:inline">Registered: {formatDate(new Date(patient.createdAt).toDateString())}</span>
                      <span className="lg:hidden">Reg: {formatDateShort(new Date(patient.createdAt).toDateString())}</span>
                    </div>
                  </div>
                </div>
                {/* Action buttons */}
                {(['SUPERADMIN', 'ADMIN', 'FRONTDESK', 'DOCTOR', 'NURSE'].includes(userRole)) && (
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
                        <span className="hidden lg:inline">Schedule Appointment</span>
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
                    <span className="text-sm text-gray-600">Age {calculateAge(patient.dateOfBirth?.toDateString())}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="block">Phone</span>
                      <span className="font-medium text-gray-900">{patient.phone}</span>
                    </div>
                    <div>
                      <span className="block">Registered</span>
                      <span className="font-medium text-gray-900">{formatDateShort(new Date(patient.createdAt).toDateString())}</span>
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
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Patient Details Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            {/* Mobile: Scrollable tabs */}
            <div className="md:hidden">
              <ScrollArea className="w-full">
                <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-max min-w-full">
                  <TabsTrigger value="overview" className="px-4 py-2 text-sm whitespace-nowrap">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="personal" className="px-4 py-2 text-sm whitespace-nowrap">
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="medical" className="px-4 py-2 text-sm whitespace-nowrap">
                    Medical
                  </TabsTrigger>
                  <TabsTrigger value="insurance" className="px-4 py-2 text-sm whitespace-nowrap">
                    Insurance
                  </TabsTrigger>
                  <TabsTrigger value="history" className="px-4 py-2 text-sm whitespace-nowrap">
                    History
                  </TabsTrigger>
                </TabsList>
              </ScrollArea>
            </div>

            {/* Desktop: Regular tabs */}
            <div className="hidden md:block">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="medical">Medical</TabsTrigger>
                <TabsTrigger value="insurance">Insurance</TabsTrigger>
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
                          <p className="text-xs text-gray-600">Primary Phone</p>
                          <p className="font-medium text-sm truncate">{patient.phone}</p>
                        </div>
                      </div>
                      {patient.alternatePhone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-600">Alternate Phone</p>
                            <p className="font-medium text-sm truncate">{patient.alternatePhone}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-600">Email</p>
                          <p className="font-medium text-sm truncate">{patient.email}</p>
                        </div>
                      </div>
                    </div>

                    {patient.address && (
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-600">Address</p>
                          <p className="font-medium text-sm leading-relaxed">
                            {patient.address}
                            {patient.lga && `, ${patient.lga}`}
                            {patient.state && `, ${patient.state}`}
                            {patient.country && `, ${patient.country}`}
                          </p>
                        </div>
                      </div>
                    )}
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
                    {patient.emergencyName ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <p className="font-medium text-sm">{patient.emergencyName}</p>
                          {patient.emergencyRelation && (
                            <p className="text-xs text-gray-600 mt-1">Relationship: {patient.emergencyRelation}</p>
                          )}
                        </div>
                        {patient.emergencyPhone && (
                          <div className="flex items-center space-x-3">
                            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-600">Emergency Phone</p>
                              <p className="font-medium text-sm">{patient.emergencyPhone}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">No emergency contact specified</p>
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
                        <p className="text-xs text-gray-600">{patient.visits && patient?.visits?.length > 0 ? formatDate(patient.visits[0].visitDate.toDateString()) : "No visits recorded"}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">Patient Registered</p>
                        <p className="text-xs text-gray-600">{formatDate(new Date(patient.createdAt).toDateString())}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Basic Information */}
                <Card className="border-blue-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg text-blue-900 flex items-center">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">Date of Birth</p>
                        <p className="font-medium text-sm">{formatDate(patient.dateOfBirth?.toDateString())}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Age</p>
                        <p className="font-medium text-sm">{calculateAge(patient.dateOfBirth?.toDateString())} years</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Gender</p>
                        <p className="font-medium text-sm">{formatEnumValue(patient.gender ? patient.gender : "")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Marital Status</p>
                        <p className="font-medium text-sm">{formatEnumValue(patient.maritalStatus ? patient.maritalStatus : "")}</p>
                      </div>
                      {patient.occupation && (
                        <div>
                          <p className="text-xs text-gray-600">Occupation</p>
                          <p className="font-medium text-sm">{patient.occupation}</p>
                        </div>
                      )}
                      {patient.religion && (
                        <div>
                          <p className="text-xs text-gray-600">Religion</p>
                          <p className="font-medium text-sm">{patient.religion}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Medical Identifiers */}
                <Card className="border-blue-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg text-blue-900 flex items-center">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                      Medical Identifiers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">Blood Group</p>
                        <p className="font-medium text-sm">{formatEnumValue(patient.bloodGroup ? patient.bloodGroup : "")}</p>
                      </div>
                      {patient.genotype && (
                        <div>
                          <p className="text-xs text-gray-600">Genotype</p>
                          <p className="font-medium text-sm">{patient.genotype}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Medical Tab */}
            <TabsContent value="medical" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Allergies */}
                <Card className="border-blue-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg text-blue-900">Allergies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.allergies ? (
                      <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                        <p className="text-sm text-red-800">{patient.allergies}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">No known allergies</p>
                    )}
                  </CardContent>
                </Card>

                {/* Current Medications */}
                <Card className="border-blue-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg text-blue-900">Current Medications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.currentMedications ? (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm">{patient.currentMedications}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">No current medications</p>
                    )}
                  </CardContent>
                </Card>

                {/* Chronic Conditions */}
                <Card className="border-blue-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg text-blue-900">Chronic Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.chronicConditions ? (
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm">{patient.chronicConditions}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">No chronic conditions reported</p>
                    )}
                  </CardContent>
                </Card>

                {/* Past Medical History */}
                <Card className="border-blue-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg text-blue-900">Past Medical History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.pastMedicalHistory ? (
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm">{patient.pastMedicalHistory}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">No past medical history recorded</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Additional Medical Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="border-blue-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg text-blue-900">Past Surgical History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.pastSurgicalHistory ? (
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm">{patient.pastSurgicalHistory}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">No surgical history recorded</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-blue-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg text-blue-900">Family History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.familyHistory ? (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm">{patient.familyHistory}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">No family history recorded</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Immunization Records */}
              <Card className="border-blue-100 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg text-blue-900">Immunization Records</CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.immunizationRecords ? (
                    <div className="p-3 bg-teal-50 rounded-lg">
                      <p className="text-sm">{patient.immunizationRecords}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm">No immunization records available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insurance" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Insurance Information */}
                <Card className="border-blue-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg text-blue-900 flex items-center">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                      Insurance Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-600">Insurance Provider</p>
                      <p className="font-medium text-sm">{patient.insuranceProvider || "Not specified"}</p>
                    </div>
                    {patient.insuranceNumber && (
                      <div>
                        <p className="text-xs text-gray-600">Insurance Number</p>
                        <p className="font-medium text-sm font-mono">{patient.insuranceNumber}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment & Administrative */}
                <Card className="border-blue-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg text-blue-900 flex items-center">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                      Payment & Administrative
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-600">Payment Method</p>
                      <p className="font-medium text-sm">{formatEnumValue(patient.paymentMethod ? patient.paymentMethod : "")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Registration Type</p>
                      <p className="font-medium text-sm">{formatEnumValue(patient.registrationType ? patient.registrationType : "")}</p>
                    </div>
                    {patient.primaryDoctorId && (
                      <div>
                        <p className="text-xs text-gray-600">Primary Doctor ID</p>
                        <p className="font-medium text-sm font-mono">{patient.primaryDoctorId}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-4">
              <Card className="border-blue-100 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg text-blue-900 flex items-center">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                    Patient Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">
                          Patient registered via {formatEnumValue(patient.registrationType)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(new Date(patient.createdAt)?.toDateString())}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-green-600 rounded-full flex-shrink-0 mt-1"></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">Last updated</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(new Date(patient.updatedAt)?.toDateString())}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
