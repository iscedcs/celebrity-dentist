"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Eye,
  Edit,
  Phone,
  Mail,
  Calendar,
  Filter,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
// import { getPatientsAction } from "@/app/actions/patients";
import { toast } from "sonner";

interface PatientsTableProps {
  userRole: string;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  dateOfBirth: string;
  gender?: string;
  status: string;
  lastVisit?: string;
  createdAt: string;
}

export function PatientsTable({ userRole }: PatientsTableProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm, statusFilter]);

  const loadPatients = async () => {
    setLoading(true);
    // try {
    //   const result = await getPatientsAction();
    //   if (result.success) {
    //     setPatients(result.patients || []);
    //   } else {
    //     toast.error("Failed to load patients");
    //   }
    // } catch (error) {
    //   toast.error("Error loading patients");
    // } finally {
    //   setLoading(false);
    // }
  };

  const filterPatients = () => {
    let filtered = patients;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          `${patient.firstName || ""} ${patient.lastName || ""}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phone?.includes(searchTerm) ||
          patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((patient) => patient.status === statusFilter);
    }

    setFilteredPatients(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800 text-xs">Inactive</Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName && firstName.length > 0 ? firstName[0] : "";
    const last = lastName && lastName.length > 0 ? lastName[0] : "";
    return `${first}${last}`.toUpperCase() || "P";
  };

  if (loading) {
    return (
      <Card className="border-blue-100 w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl">Patients</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 border rounded-lg animate-pulse"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="w-32 sm:w-40 h-4 bg-gray-200 rounded"></div>
                    <div className="w-24 sm:w-32 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-16 sm:w-20 h-6 bg-gray-200 rounded ml-auto sm:ml-0"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-100 w-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col space-y-4">
          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
            Patients ({filteredPatients.length})
          </CardTitle>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-400 text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="relative sm:w-auto">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-blue-200 rounded-md focus:border-blue-400 focus:outline-none w-full sm:w-auto text-sm bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <Search className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-base sm:text-lg font-medium mb-2">
              No patients found
            </p>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Start by adding your first patient"}
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                {/* Mobile Layout */}
                <div className="block sm:hidden p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage
                          src="/placeholder-user.jpg"
                          alt={`${patient.firstName || ""} ${
                            patient.lastName || ""
                          }`}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                          {getInitials(patient.firstName, patient.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900 text-sm truncate">
                            {patient.firstName || "Unknown"}{" "}
                            {patient.lastName || "Patient"}
                          </h3>
                          {getStatusBadge(patient.status)}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          ID: {patient.id}
                        </p>
                      </div>
                    </div>

                    {/* Mobile Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/patients/${patient.id}`}
                            className="flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        {(userRole === "admin" ||
                          userRole === "receptionist") && (
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Mobile Patient Info */}
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Phone className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">
                        {patient.phone || "No phone"}
                      </span>
                    </div>
                    {patient.email && (
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{patient.email}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span>Age: {calculateAge(patient.dateOfBirth)}</span>
                    </div>
                    <div className="text-xs text-gray-500 pt-1 border-t border-gray-100">
                      Last visit: {formatDate(patient.lastVisit)} • Registered:{" "}
                      {formatDate(patient.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage
                        src="/placeholder-user.jpg"
                        alt={`${patient.firstName || ""} ${
                          patient.lastName || ""
                        }`}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {getInitials(patient.firstName, patient.lastName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {patient.firstName || "Unknown"}{" "}
                          {patient.lastName || "Patient"}
                        </h3>
                        <span className="text-sm text-gray-500 flex-shrink-0">
                          ({patient.id})
                        </span>
                        {getStatusBadge(patient.status)}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{patient.phone || "No phone"}</span>
                        </div>
                        {patient.email && (
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{patient.email}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>Age: {calculateAge(patient.dateOfBirth)}</span>
                        </div>
                      </div>

                      <div className="mt-1 text-xs text-gray-500">
                        Last visit: {formatDate(patient.lastVisit)} •
                        Registered: {formatDate(patient.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Actions */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Link href={`/patients/${patient.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    {(userRole === "admin" || userRole === "receptionist") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
