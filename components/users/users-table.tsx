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
  Shield,
  MoreVertical,
  UserX,
  UserCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUsersAction, updateUserStatusAction } from "@/app/actions/users";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string;
  status: string;
  lastLogin: string;
  createdAt: string;
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await getUsersAction();
      if (result.success) {
        setUsers(result.users || []);
      } else {
        toast.error("Failed to load users");
      }
    } catch (error) {
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleStatusUpdate = async (userId: string, newStatus: string) => {
    try {
      const result = await updateUserStatusAction(userId, newStatus);
      if (result.success) {
        toast.success(
          `User ${
            newStatus === "active" ? "activated" : "deactivated"
          } successfully`
        );
        loadUsers(); // Reload users
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      toast.error("Error updating user status");
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColors = {
      admin: "bg-red-100 text-red-800",
      dentist: "bg-blue-100 text-blue-800",
      receptionist: "bg-green-100 text-green-800",
      assistant: "bg-yellow-100 text-yellow-800",
    };
    return (
      <Badge
        className={`text-xs ${
          roleColors[role as keyof typeof roleColors] ||
          "bg-gray-100 text-gray-800"
        }`}
      >
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <Card className="border-blue-100 w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg md:text-xl">Users</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <div className="space-y-3 md:space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 md:p-4 border rounded-lg animate-pulse"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="w-32 md:w-40 h-4 bg-gray-200 rounded"></div>
                    <div className="w-24 md:w-32 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="flex justify-between sm:justify-end items-center">
                  <div className="w-16 md:w-20 h-6 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded sm:ml-2"></div>
                </div>
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
        <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
          <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">
            System Users ({filteredUsers.length})
          </CardTitle>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64 border-blue-200 focus:border-blue-400 text-sm"
              />
            </div>

            {/* Role Filter */}
            <div className="relative flex-1 sm:flex-initial">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-blue-200 rounded-md focus:border-blue-400 focus:outline-none w-full sm:w-auto text-sm bg-white"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="dentist">Dentist</option>
                <option value="receptionist">Receptionist</option>
                <option value="assistant">Assistant</option>
              </select>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 md:px-6">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 md:py-12 text-gray-500">
            <Shield className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg md:text-xl font-medium mb-2">
              No users found
            </p>
            <p className="text-sm md:text-base">
              {searchTerm || roleFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Start by adding your first user"}
            </p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                {/* Mobile Layout */}
                <div className="block sm:hidden p-4 space-y-3">
                  {/* User Info Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage
                          src="/placeholder-user.jpg"
                          alt={user.name}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate text-sm">
                          {user.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.status)}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-200 bg-transparent h-8 w-8 p-0"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        {user.status === "active" ? (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(user.id, "inactive")
                            }
                            className="text-red-600 focus:text-red-600"
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(user.id, "active")
                            }
                            className="text-green-600 focus:text-green-600"
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Activate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{user.phone}</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Last login: {formatDate(user.lastLogin)}</div>
                    <div>Created: {formatDate(user.createdAt)}</div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Desktop/Tablet Layout */}
                <div className="hidden sm:flex items-center justify-between p-4 md:p-5">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage
                        src="/placeholder-user.jpg"
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900 truncate">
                          {user.name}
                        </h3>
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status)}
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-1 lg:space-y-0 text-sm text-gray-600">
                        <div className="flex items-center space-x-2 min-w-0">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{user.phone}</span>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-gray-500">
                        <span className="inline-block mr-4">
                          Last login: {formatDate(user.lastLogin)}
                        </span>
                        <span className="inline-block">
                          Created: {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent hidden md:flex"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-200 bg-transparent"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="md:hidden">
                          <Eye className="w-4 h-4 mr-2" />
                          View User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        {user.status === "active" ? (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(user.id, "inactive")
                            }
                            className="text-red-600 focus:text-red-600"
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(user.id, "active")
                            }
                            className="text-green-600 focus:text-green-600"
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Activate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
