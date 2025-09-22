import { getCurrentUser } from "@/actions/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { redirect } from "next/navigation";
import React from "react";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div>
      {<DashboardHeader user={user} />}
      {children}
    </div>
  );
}
