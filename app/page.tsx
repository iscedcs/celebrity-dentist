import { LoginForm } from "@/components/auth/login-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Whiten Lighten Dental</h1>
          <p className="text-blue-600">Patient Management System</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
