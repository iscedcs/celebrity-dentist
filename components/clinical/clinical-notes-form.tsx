"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { User, FileText, Activity, Calendar, Stethoscope } from "lucide-react"
// import { createClinicalNoteAction } from "@/app/actions/clinical"

// Sample patients (in real app, fetch from API)
const SAMPLE_PATIENTS = [
  { id: "PAT-2024-001", name: "John Doe", age: 39 },
  { id: "PAT-2024-002", name: "Sarah Johnson", age: 34 },
  { id: "PAT-2024-003", name: "Michael Brown", age: 46 },
  { id: "PAT-2024-004", name: "Emma Wilson", age: 29 },
  { id: "PAT-2024-005", name: "David Chen", age: 42 },
]

// Treatment types
const TREATMENT_TYPES = [
  "Consultation",
  "Cleaning",
  "Filling",
  "Root Canal",
  "Crown Placement",
  "Tooth Extraction",
  "Orthodontic Adjustment",
  "Periodontal Treatment",
  "Oral Surgery",
  "Emergency Treatment",
]

// Common diagnoses
const COMMON_DIAGNOSES = [
  "Dental caries",
  "Gingivitis",
  "Periodontitis",
  "Pulpitis",
  "Tooth abscess",
  "Impacted tooth",
  "Tooth fracture",
  "Malocclusion",
  "Oral infection",
  "TMJ disorder",
]

export function ClinicalNotesForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState("")
  const [requiresFollowUp, setRequiresFollowUp] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)

    // try {
    //   const result = await createClinicalNoteAction(formData)

    //   if (result.success) {
    //     toast.success("Clinical note created successfully!")
    //     router.push("/clinical")
    //   } else {
    //     toast.error(result.error || "Failed to create clinical note")
    //   }
    // } catch (error) {
    //   toast.error("An error occurred while creating clinical note")
    // } finally {
    //   setIsLoading(false)
    // }
  }

  const selectedPatientData = SAMPLE_PATIENTS.find((patient) => patient.id === selectedPatient)

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Patient Selection */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Patient Information
          </CardTitle>
          <CardDescription>Select the patient for this clinical note</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label htmlFor="patient">Select Patient *</Label>
            <select
              id="patient"
              name="patientId"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              required
              className="w-full px-3 py-2 border border-blue-200 rounded-md focus:border-blue-400 focus:outline-none"
            >
              <option value="">Choose a patient...</option>
              {SAMPLE_PATIENTS.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} ({patient.id})
                </option>
              ))}
            </select>

            {selectedPatientData && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">{selectedPatientData.name}</p>
                    <p className="text-sm text-blue-600">{selectedPatientData.age} years old</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Treatment Information */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Treatment Information
          </CardTitle>
          <CardDescription>Document the treatment provided</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="treatmentType">Treatment Type *</Label>
              <select
                id="treatmentType"
                name="treatmentType"
                required
                className="w-full px-3 py-2 border border-blue-200 rounded-md focus:border-blue-400 focus:outline-none"
              >
                <option value="">Select treatment type...</option>
                {TREATMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <select
                id="diagnosis"
                name="diagnosis"
                required
                className="w-full px-3 py-2 border border-blue-200 rounded-md focus:border-blue-400 focus:outline-none"
              >
                <option value="">Select diagnosis...</option>
                {COMMON_DIAGNOSES.map((diagnosis) => (
                  <option key={diagnosis} value={diagnosis}>
                    {diagnosis}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
            <Input
              id="chiefComplaint"
              name="chiefComplaint"
              placeholder="Patient's main concern or reason for visit"
              required
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment">Treatment Description *</Label>
            <Textarea
              id="treatment"
              name="treatment"
              placeholder="Detailed description of treatment provided..."
              rows={4}
              required
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vital Signs */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Vital Signs
          </CardTitle>
          <CardDescription>Record patient vital signs (optional)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodPressure">Blood Pressure</Label>
              <Input
                id="bloodPressure"
                name="bloodPressure"
                placeholder="120/80"
                className="border-blue-200 focus:border-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pulse">Pulse (bpm)</Label>
              <Input
                id="pulse"
                name="pulse"
                type="number"
                placeholder="72"
                className="border-blue-200 focus:border-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                name="temperature"
                type="number"
                step="0.1"
                placeholder="36.5"
                className="border-blue-200 focus:border-blue-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medications */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900 flex items-center">
            <Stethoscope className="w-5 h-5 mr-2" />
            Medications & Prescriptions
          </CardTitle>
          <CardDescription>Document any medications prescribed or administered</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="medications">Medications Prescribed</Label>
            <Textarea
              id="medications"
              name="medications"
              placeholder="e.g., Amoxicillin 500mg TID for 7 days, Ibuprofen 600mg QID PRN"
              rows={3}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dosageInstructions">Dosage Instructions</Label>
            <Textarea
              id="dosageInstructions"
              name="dosageInstructions"
              placeholder="Specific instructions for medication administration..."
              rows={2}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Follow-up Care */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Follow-up Care
          </CardTitle>
          <CardDescription>Schedule and document follow-up requirements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="requiresFollowUp"
              checked={requiresFollowUp}
              onCheckedChange={(checked) => setRequiresFollowUp(checked as boolean)}
            />
            <Label htmlFor="requiresFollowUp">Patient requires follow-up appointment</Label>
          </div>

          {requiresFollowUp && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="followUpDate">Follow-up Date</Label>
                <Input
                  id="followUpDate"
                  name="followUpDate"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="followUpInstructions">Follow-up Instructions</Label>
                <Input
                  id="followUpInstructions"
                  name="followUpInstructions"
                  placeholder="e.g., Return in 2 weeks for crown preparation"
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Additional Clinical Notes</CardTitle>
          <CardDescription>Any additional observations or notes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Clinical Observations</Label>
            <Textarea
              id="additionalNotes"
              name="additionalNotes"
              placeholder="Additional clinical observations, patient behavior, complications, etc..."
              rows={4}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
          {isLoading ? "Creating..." : "Create Clinical Note"}
        </Button>
      </div>
    </form>
  )
}
