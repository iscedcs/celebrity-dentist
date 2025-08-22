"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  AlertCircle,
  Loader2,
} from "lucide-react";
// import {
//   createAppointmentAction,
//   checkAvailabilityAction,
// } from "@/app/actions/appointments";
// import {
//   getPatientsForDropdownAction,
//   getDentistsForDropdownAction,
// } from "@/app/actions/data-fetching";

// Appointment types with durations
const APPOINTMENT_TYPES = [
  {
    value: "consultation",
    label: "Consultation",
    duration: 60,
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "cleaning",
    label: "Dental Cleaning",
    duration: 60,
    color: "bg-green-100 text-green-800",
  },
  {
    value: "filling",
    label: "Filling",
    duration: 60,
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "crown",
    label: "Crown Placement",
    duration: 120,
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "root-canal",
    label: "Root Canal",
    duration: 180,
    color: "bg-red-100 text-red-800",
  },
  {
    value: "extraction",
    label: "Tooth Extraction",
    duration: 90,
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: "checkup",
    label: "Regular Checkup",
    duration: 30,
    color: "bg-gray-100 text-gray-800",
  },
];

interface Patient {
  id: string;
  name: string;
  phone: string;
}

interface Dentist {
  id: string;
  name: string;
  specialization: string;
}

export function AppointmentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedType, setSelectedType] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDentist, setSelectedDentist] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availability, setAvailability] = useState<string[]>([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const router = useRouter();

  // Fetch patients and dentists on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      // try {
      //   const [patientsResult, dentistsResult] = await Promise.all([
      //     getPatientsForDropdownAction(),
      //     getDentistsForDropdownAction(),
      //   ]);

      //   if (patientsResult.success) {
      //     setPatients(patientsResult.patients ?? []);
      //   } else {
      //     toast.error("Failed to load patients");
      //   }

      //   if (dentistsResult.success) {
      //     setDentists(dentistsResult.dentists ?? []);
      //   } else {
      //     toast.error("Failed to load dentists");
      //   }
      // } catch (error) {
      //   toast.error("Failed to load data");
      // } finally {
      //   setLoadingData(false);
      // }
    };

    fetchData();
  }, []);

  // Generate time slots from 8:00 AM to 6:00 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Check availability when date or dentist changes
  useEffect(() => {
    if (selectedDate && selectedDentist && selectedType) {
      checkAvailability();
    }
  }, [selectedDate, selectedDentist, selectedType]);

  const checkAvailability = async () => {
    setCheckingAvailability(true);
    // try {
    //   const appointmentType = APPOINTMENT_TYPES.find(
    //     (type) => type.value === selectedType
    //   );
    //   if (!appointmentType) return;

    //   const result = await checkAvailabilityAction({
    //     date: selectedDate,
    //     dentistId: selectedDentist,
    //     duration: appointmentType.duration,
    //   });

    //   if (result.success) {
    //     setAvailability(result.availableSlots || []);
    //   } else {
    //     setAvailability([]);
    //     toast.error("Failed to check availability");
    //   }
    // } catch (error) {
    //   setAvailability([]);
    //   toast.error("Error checking availability");
    // } finally {
    //   setCheckingAvailability(false);
    // }
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    return `${endHours.toString().padStart(2, "0")}:${endMins
      .toString()
      .padStart(2, "0")}`;
  };

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);

    // try {
    //   const appointmentType = APPOINTMENT_TYPES.find(
    //     (type) => type.value === selectedType
    //   );
    //   if (!appointmentType) {
    //     toast.error("Please select an appointment type");
    //     return;
    //   }

    //   // Add calculated fields to form data
    //   formData.append("duration", appointmentType.duration.toString());
    //   formData.append(
    //     "endTime",
    //     calculateEndTime(selectedTime, appointmentType.duration)
    //   );
    //   formData.append("typeName", appointmentType.label);

    //   const result = await createAppointmentAction(formData);

    //   if (result.success) {
    //     toast.success("Appointment scheduled successfully!");
    //     router.push("/appointments");
    //   } else {
    //     toast.error(result.error || "Failed to schedule appointment");
    //   }
    // } catch (error) {
    //   toast.error("An error occurred while scheduling appointment");
    // } finally {
    //   setIsLoading(false);
    // }
  }

  const selectedAppointmentType = APPOINTMENT_TYPES.find(
    (type) => type.value === selectedType
  );
  const selectedPatientData = patients.find(
    (patient) => patient.id === selectedPatient
  );
  const selectedDentistData = dentists.find(
    (dentist) => dentist.id === selectedDentist
  );

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading appointment form...</span>
        </div>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Appointment Type Selection */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900 flex items-center">
            <Stethoscope className="w-5 h-5 mr-2" />
            Appointment Type
          </CardTitle>
          <CardDescription>Select the type of dental procedure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {APPOINTMENT_TYPES.map((type) => (
              <div
                key={type.value}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedType === type.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
                onClick={() => setSelectedType(type.value)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{type.label}</h3>
                  <Badge className={type.color}>{type.duration}min</Badge>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {type.duration} minutes
                </div>
              </div>
            ))}
          </div>
          <input type="hidden" name="type" value={selectedType} />
        </CardContent>
      </Card>

      {/* Patient Selection */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Patient Selection
          </CardTitle>
          <CardDescription>
            Choose the patient for this appointment
          </CardDescription>
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
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>

            {selectedPatientData && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">
                      {selectedPatientData.name}
                    </p>
                    <p className="text-sm text-blue-600">
                      {selectedPatientData.phone}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dentist Selection */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900 flex items-center">
            <Stethoscope className="w-5 h-5 mr-2" />
            Dentist Assignment
          </CardTitle>
          <CardDescription>
            Assign a dentist to this appointment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label htmlFor="dentist">Select Dentist *</Label>
            <select
              id="dentist"
              name="dentistId"
              value={selectedDentist}
              onChange={(e) => setSelectedDentist(e.target.value)}
              required
              className="w-full px-3 py-2 border border-blue-200 rounded-md focus:border-blue-400 focus:outline-none"
            >
              <option value="">Choose a dentist...</option>
              {dentists.map((dentist) => (
                <option key={dentist.id} value={dentist.id}>
                  {dentist.name} - {dentist.specialization}
                </option>
              ))}
            </select>

            {selectedDentistData && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <Stethoscope className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">
                      {selectedDentistData.name}
                    </p>
                    <p className="text-sm text-blue-600">
                      {selectedDentistData.specialization}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Date and Time Selection */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Date & Time
          </CardTitle>
          <CardDescription>
            Select the appointment date and time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Appointment Date *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                className="border-blue-200 focus:border-blue-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Start Time *</Label>
              <select
                id="time"
                name="startTime"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
                disabled={!selectedDate || !selectedDentist || !selectedType}
                className="w-full px-3 py-2 border border-blue-200 rounded-md focus:border-blue-400 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select time...</option>
                {timeSlots.map((time) => {
                  const isAvailable = availability.includes(time);
                  const isDisabled =
                    !!selectedDate &&
                    !!selectedDentist &&
                    !!selectedType &&
                    !isAvailable;

                  return (
                    <option key={time} value={time} disabled={isDisabled}>
                      {time} {isDisabled ? "(Unavailable)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {checkingAvailability && (
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Checking availability...</span>
            </div>
          )}

          {selectedDate &&
            selectedDentist &&
            selectedType &&
            !checkingAvailability && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>
                    Available time slots for{" "}
                    {new Date(selectedDate).toLocaleDateString()}:
                  </strong>
                </p>
                {availability.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {availability.map((time) => (
                      <Badge
                        key={time}
                        variant="outline"
                        className={`cursor-pointer ${
                          selectedTime === time
                            ? "bg-blue-100 border-blue-500"
                            : "hover:bg-blue-50"
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">
                      No available slots for the selected date and dentist
                    </span>
                  </div>
                )}
              </div>
            )}

          {selectedAppointmentType && selectedTime && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">
                    Appointment Summary
                  </p>
                  <p className="text-sm text-blue-600">
                    {selectedAppointmentType.label} - {selectedTime} to{" "}
                    {calculateEndTime(
                      selectedTime,
                      selectedAppointmentType.duration
                    )}
                  </p>
                </div>
                <Badge className={selectedAppointmentType.color}>
                  {selectedAppointmentType.duration} min
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">
            Additional Information
          </CardTitle>
          <CardDescription>
            Any special notes or instructions for this appointment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any special instructions, patient concerns, or preparation notes..."
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
        <Button
          type="submit"
          disabled={
            isLoading ||
            !selectedType ||
            !selectedPatient ||
            !selectedDentist ||
            !selectedDate ||
            !selectedTime
          }
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? "Scheduling..." : "Schedule Appointment"}
        </Button>
      </div>
    </form>
  );
}
