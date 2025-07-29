import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ClinicalNotesForm } from "@/components/clinical/clinical-notes-form"

export default async function NewClinicalNotePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  // Only admin and dentist can create clinical notes
  if (user.role !== "admin" && user.role !== "dentist") {
    redirect("/clinical")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add Clinical Note</h1>
          <p className="text-gray-600">Document patient treatment and clinical observations</p>
        </div>

        <ClinicalNotesForm />
      </main>
    </div>
  )
}
