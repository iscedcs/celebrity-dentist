"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { approvePatient, getPatientsByPatientID } from "@/actions/patients";
import { toast } from "sonner"; // or any other toast system

export default function ApprovePatient({ patientId }: { patientId: string }) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    const patient = await getPatientsByPatientID(patientId);
    const result = await approvePatient(patient?.id ?? "");
    setLoading(false);

    if (result.success) {
      toast.success("Patient approved successfully!");
      // optional: refresh page or router.refresh() if using Next.js 13+
    } else {
      toast.error(result.error || "Failed to approve patient");
    }
  };

  return (
    <Button onClick={handleApprove} disabled={loading} className="w-full">
      {loading ? "Admitting..." : "Admit Patient"}
    </Button>
  );
}
