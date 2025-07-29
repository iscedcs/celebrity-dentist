"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, FileText, User, Clock } from "lucide-react";

interface RecentActivityProps {
  userRole: string;
}

interface Activity {
  id: string;
  type:
    | "appointment"
    | "clinical_note"
    | "patient_registration"
    | "user_action";
  title: string;
  description: string;
  timestamp: string;
  user: string;
  status?: string;
}

export function RecentActivity({ userRole }: RecentActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const sampleActivities: Activity[] = [
        {
          id: "1",
          type: "appointment",
          title: "New Appointment Scheduled",
          description: "Root canal treatment for John Doe",
          timestamp: "2024-01-29T10:30:00Z",
          user: "Grace Adebayo",
          status: "scheduled",
        },
        {
          id: "2",
          type: "clinical_note",
          title: "Clinical Note Added",
          description: "Post-treatment notes for Sarah Johnson",
          timestamp: "2024-01-29T09:15:00Z",
          user: "Dr. Michael Chen",
          status: "completed",
        },
        {
          id: "3",
          type: "patient_registration",
          title: "New Patient Registered",
          description: "Emma Wilson added to system",
          timestamp: "2024-01-29T08:45:00Z",
          user: "Grace Adebayo",
          status: "active",
        },
        {
          id: "4",
          type: "appointment",
          title: "Appointment Completed",
          description: "Dental cleaning for Michael Brown",
          timestamp: "2024-01-28T16:30:00Z",
          user: "Dr. Michael Chen",
          status: "completed",
        },
        {
          id: "5",
          type: "clinical_note",
          title: "Treatment Plan Updated",
          description: "Orthodontic plan for David Chen",
          timestamp: "2024-01-28T14:20:00Z",
          user: "Dr. Amina Hassan",
          status: "in-progress",
        },
      ];

      // Filter activities based on user role
      let filteredActivities = sampleActivities;
      if (userRole === "receptionist") {
        filteredActivities = sampleActivities.filter((activity) =>
          ["appointment", "patient_registration"].includes(activity.type)
        );
      } else if (userRole === "assistant") {
        filteredActivities = sampleActivities.filter(
          (activity) => activity.type === "appointment"
        );
      }

      setActivities(filteredActivities.slice(0, 8));
      setLoading(false);
    };

    loadActivities();
  }, [userRole]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return Calendar;
      case "clinical_note":
        return FileText;
      case "patient_registration":
        return User;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "appointment":
        return "text-blue-600 bg-blue-100";
      case "clinical_note":
        return "text-purple-600 bg-purple-100";
      case "patient_registration":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    const statusColors = {
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      active: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <Badge
        className={`text-xs ${
          statusColors[status as keyof typeof statusColors] ||
          "bg-gray-100 text-gray-800"
        }`}
      >
        {status.replace("-", " ")}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  if (loading) {
    return (
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className=" px-[10px]">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No recent activity</p>
            <p className="text-sm">Activity will appear here as it happens</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div
                    className={`p-2 rounded-full ${getActivityColor(
                      activity.type
                    )}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      {getStatusBadge(activity.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Avatar className="w-4 h-4">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="text-xs">
                          {activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{formatTimestamp(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
