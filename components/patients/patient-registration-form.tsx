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
import { User, Phone, Mail, MapPin, AlertTriangle, FileText } from "lucide-react"
import { createPatientAction } from "@/app/actions/patients"

const MEDICAL_CONDITIONS = [
  "High Blood Pressure",
  "Diabetes",
  "Heart Disease",
  "Asthma",
  "Allergies",
  "Pregnancy",
  "Blood Disorders",
  "Kidney Disease",
  "Liver Disease",
  "Cancer",
  "HIV/AIDS",
  "Hepatitis",
]

export function PatientRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)

    try {
      // Add selected medical conditions to form data
      selectedConditions.forEach((condition) => {
        formData.append("medicalChecklist", condition)
      })

      const result = await createPatientAction(formData)

      if (result.success) {
        toast.success("Patient registered successfully!")
        router.push("/patients")
      } else {
        toast.error(result.error || "Failed to register patient")
      }
    } catch (error) {
      toast.error("An error occurred while registering patient")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setSelectedConditions([...selectedConditions, condition])
    } else {
      setSelectedConditions(selectedConditions.filter((c) => c !== condition))
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </CardTitle>
          <CardDescription>Basic patient details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Enter first name"
                required
                className="border-blue-200 focus:border-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Enter last name"
                required
                className="border-blue-200 focus:border-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="patient@example.com"
                  className="pl-10 border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+234-801-234-5678"
                  required
                  className="pl-10 border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                className="border-blue-200 focus:border-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                className="w-full px-3 py-2 border border-blue-200 rounded-md focus:border-blue-400 focus:outline-none"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="address"
                name="address"
                placeholder="Enter full address"
                rows={2}
                className="pl-10 border-blue-200 focus:border-blue-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Emergency Contact</Label>
            <Input
              id="emergencyContact"
              name="emergencyContact"
              placeholder="Name and phone number"
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Medical Information
          </CardTitle>
          <CardDescription>Medical history and health conditions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Textarea
              id="allergies"
              name="allergies"
              placeholder="List any known allergies (medications, foods, materials, etc.)"
              rows={2}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medications">Current Medications</Label>
            <Textarea
              id="medications"
              name="medications"
              placeholder="List current medications and dosages"
              rows={2}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalConditions">Medical Conditions</Label>
            <Textarea
              id="medicalConditions"
              name="medicalConditions"
              placeholder="Describe any medical conditions or chronic illnesses"
              rows={2}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div className="space-y-3">
            <Label>Medical History Checklist</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {MEDICAL_CONDITIONS.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={condition}
                    checked={selectedConditions.includes(condition)}
                    onCheckedChange={(checked) => handleConditionChange(condition, checked as boolean)}
                  />
                  <Label htmlFor={condition} className="text-sm font-normal cursor-pointer">
                    {condition}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dental History */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Dental History
          </CardTitle>
          <CardDescription>Previous dental treatments and oral health information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dentalHistory">Previous Dental Work</Label>
            <Textarea
              id="dentalHistory"
              name="dentalHistory"
              placeholder="Describe any previous dental treatments, surgeries, or ongoing issues"
              rows={3}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any additional information, concerns, or special instructions"
              rows={3}
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
          {isLoading ? "Registering..." : "Register Patient"}
        </Button>
      </div>
    </form>
  )
}
