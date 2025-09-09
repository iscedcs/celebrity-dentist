import { getCurrentUser } from "@/actions/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import React from "react";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div>
      {user ? <DashboardHeader user={user} /> : <div>Loading...</div>}
      {children}
    </div>
  );
}
