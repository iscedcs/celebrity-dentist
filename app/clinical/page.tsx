import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ClinicalNotesTable } from "@/components/clinical/clinical-notes-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function ClinicalPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clinical Notes</h1>
            <p className="text-gray-600">Patient treatment records and clinical documentation</p>
          </div>
          {(user.role === "admin" || user.role === "dentist") && (
            <Link href="/clinical/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Clinical Note
              </Button>
            </Link>
          )}
        </div>

        <ClinicalNotesTable userRole={user.role} />
      </main>
    </div>
  )
}
