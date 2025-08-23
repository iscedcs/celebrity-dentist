import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PatientDetailView } from "@/components/patients/patient-detail-view";
import { getCurrentUser } from "@/actions/auth";
import { getPatientByIdAction } from "@/actions/patients";

interface PatientDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PatientDetailPage({
  params,
}: PatientDetailPageProps) {
  const rParams = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const result = await getPatientByIdAction(rParams.id);

  if (!result || !result.patient) {
    redirect("/patients");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <PatientDetailView patient={result.patient} userRole={user.role} />
      </main>
    </div>
  );
}
