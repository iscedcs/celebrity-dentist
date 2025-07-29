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
import { toast } from "sonner";
import { loginAction } from "@/app/actions/auth";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);

    try {
      const result = await loginAction(formData);

      if (result.success) {
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-blue-200 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-blue-900">
          Sign In
        </CardTitle>
        <CardDescription className="text-center text-blue-600">
          Enter your credentials to access the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">
            Demo Accounts:
          </p>
          <div className="space-y-1 text-xs text-blue-700">
            <p>
              <strong>Admin:</strong> admin@whitenlighten.com / admin123
            </p>
            {/* <p>
              <strong>Dentist:</strong> dentist@whitenlighten.com / dentist123
            </p>
            <p>
              <strong>Receptionist:</strong> receptionist@whitenlighten.com / receptionist123
            </p>
            <p>
              <strong>Assistant:</strong> assistant@whitenlighten.com / assistant123
            </p> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
