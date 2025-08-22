"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Clock, UserCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getDashboardStatsAction } from "@/actions/data-fetching";

interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingAppointments: number;
  totalUsers: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getDashboardStatsAction();
        if (result.success) {
          setStats(result.stats ?? null);
        } else {
          toast.error("Failed to load dashboard statistics");
        }
      } catch (error) {
        toast.error("Error loading dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Loading data...</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Failed to load dashboard statistics
        </p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      description: "Active patients in system",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Today",
      value: stats.todayAppointments,
      description: "Scheduled for today",
      icon: Calendar,
      color: "text-green-600",
    },
    {
      title: "Pending",
      value: stats.pendingAppointments,
      description: "Awaiting confirmation",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Active Users",
      value: stats.totalUsers,
      description: "Staff members",
      icon: UserCheck,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
