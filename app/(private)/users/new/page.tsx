import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UserCreationForm } from "@/components/users/user-creation-form"
import { getCurrentUser } from "@/actions/auth"

export default async function NewUserPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  // Only admin can create users
  if (user.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
          <p className="text-gray-600">Create a new system user with role assignment</p>
        </div>

        <UserCreationForm />
      </main>
    </div>
  )
}
