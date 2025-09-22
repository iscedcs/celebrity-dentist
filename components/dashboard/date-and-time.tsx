"use client";
import { formatDate, formatTime } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export default function DateAndTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-row gap-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Calendar className="w-4 h-4" />
        <p>{formatDate(currentTime.toDateString())}</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock className="w-4 h-4" />
        <p>{formatTime(currentTime)}</p>
      </div>
    </div>
  );
}
