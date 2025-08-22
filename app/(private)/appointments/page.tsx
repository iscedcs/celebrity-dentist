import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AppointmentCalendar } from "@/components/appointments/appointment-calendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/actions/auth";

export default async function AppointmentsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between gap-2 flex-wrap items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600">
              Manage patient appointments and scheduling
            </p>
          </div>
          <Link href="/appointments/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Appointment
            </Button>
          </Link>
        </div>

        <AppointmentCalendar userRole={user.role} />
      </main>
    </div>
  );
}
