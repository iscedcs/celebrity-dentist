"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { approvePatientAction } from "@/actions/patients";
import { toast } from "sonner"; // or any other toast system

export default function ApprovePatient({ patientId }: { patientId: string }) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    const result = await approvePatientAction(patientId);
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
      {loading ? "Approving..." : "Approve Patient"}
    </Button>
  );
}
