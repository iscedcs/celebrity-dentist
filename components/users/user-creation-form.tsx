"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User, Mail, Phone, Lock, Shield, UserCheck } from "lucide-react";
import { createUserAction } from "@/app/actions/users";

const USER_ROLES = [
  {
    value: "admin",
    label: "Administrator",
    description: "Full system access and user management",
    color: "bg-red-100 text-red-800",
    permissions: [
      "All system functions",
      "User management",
      "System settings",
      "Reports",
    ],
  },
  {
    value: "dentist",
    label: "Dentist",
    description: "Clinical access and patient treatment",
    color: "bg-blue-100 text-blue-800",
    permissions: [
      "Patient records",
      "Clinical notes",
      "Appointments",
      "Treatment planning",
    ],
  },
  {
    value: "receptionist",
    label: "Receptionist",
    description: "Patient management and scheduling",
    color: "bg-green-100 text-green-800",
    permissions: [
      "Patient registration",
      "Appointment scheduling",
      "Basic patient info",
    ],
  },
  {
    value: "assistant",
    label: "Dental Assistant",
    description: "Limited access to support dentists",
    color: "bg-yellow-100 text-yellow-800",
    permissions: [
      "View appointments",
      "Basic patient info",
      "Assist with procedures",
    ],
  },
];

export function UserCreationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);

    try {
      const result = await createUserAction(formData);

      if (result.success) {
        toast.success("User created successfully!");
        router.push("/users");
      } else {
        toast.error(result.error || "Failed to create user");
      }
    } catch (error) {
      toast.error("An error occurred while creating user");
    } finally {
      setIsLoading(false);
    }
  }

  const selectedRoleData = USER_ROLES.find(
    (role) => role.value === selectedRole
  );

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Basic user details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter full name (e.g., Dr. John Smith)"
              required
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="user@whitenlighten.com"
                  required
                  className="pl-10 border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+234-801-234-5678"
                  required
                  className="pl-10 border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900 flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Security Information
          </CardTitle>
          <CardDescription>
            Login credentials and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter secure password"
                required
                className="pl-10 pr-12 border-blue-200 focus:border-blue-400"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Password must be at least 6 characters long and contain letters
              and numbers
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Role Assignment */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Role Assignment
          </CardTitle>
          <CardDescription>
            Select the user&apos;s role and permissions level
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {USER_ROLES.map((role) => (
              <div
                key={role.value}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedRole === role.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
                onClick={() => setSelectedRole(role.value)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{role.label}</h3>
                  <Badge className={role.color}>{role.value}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-700">
                    Key Permissions:
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {role.permissions.slice(0, 2).map((permission, index) => (
                      <li key={index} className="flex items-center">
                        <UserCheck className="w-3 h-3 mr-1 text-green-500" />
                        {permission}
                      </li>
                    ))}
                    {role.permissions.length > 2 && (
                      <li className="text-gray-500">
                        +{role.permissions.length - 2} more...
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <input type="hidden" name="role" value={selectedRole} />

          {selectedRoleData && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <h4 className="font-medium text-blue-900">
                  Selected Role: {selectedRoleData.label}
                </h4>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                {selectedRoleData.description}
              </p>
              <div>
                <p className="text-sm font-medium text-blue-800 mb-2">
                  Full Permissions:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {selectedRoleData.permissions.map((permission, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-blue-700"
                    >
                      <UserCheck className="w-3 h-3 mr-2 text-blue-500" />
                      {permission}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !selectedRole}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? "Creating..." : "Create User"}
        </Button>
      </div>
    </form>
  );
}
