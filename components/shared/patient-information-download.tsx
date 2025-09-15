"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function PatientInformationDownload({
  patientId,
}: {
  patientId: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/patient/${patientId}`);

      if (!res.ok) {
        toast.error("Failed to download patient details");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${patientId}-PATIENT-DETAILS.pdf`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Patient details downloaded");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Something went wrong while downloading");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={loading} className="w-full">
      {loading ? "Downloading" : "Download Patient Details"}
    </Button>
  );
}
