import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AppointmentForm } from "@/components/appointments/appointment-form"

export default async function NewAppointmentPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Schedule New Appointment</h1>
          <p className="text-gray-600">Book a new appointment for a patient</p>
        </div>

        <AppointmentForm />
      </main>
    </div>
  )
}
