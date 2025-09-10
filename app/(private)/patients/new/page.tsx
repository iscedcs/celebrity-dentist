import { getCurrentUser } from "@/actions/auth";
import { PatientRegistrationForm } from "@/components/patients/patient-registration-form";
import { redirect } from "next/navigation";

export default async function NewPatientPage() {


  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New Patient</h1>
          <p className="text-gray-600">Register a new patient in the system</p>
        </div>

        <PatientRegistrationForm />
      </main>
    </div>
  );
}
