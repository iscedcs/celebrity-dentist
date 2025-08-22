"use client";

import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { sigIn } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
// import { loginAction } from "@/app/actions/auth";

export type SignInValues = z.infer<typeof sigIn>;
export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignInValues>({
    resolver: zodResolver(sigIn),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(formData: SignInValues) {
    const payload = {
      email: formData.email,
      password: formData.password,
    };
    setIsLoading(true);
    try {
      const res = await login(payload);
      if (res != null) {
        router.push("/dashboard");
        toast.success("Login successful", {
          description: "Your account has been logged in successfully",
        });
      } else {
        setIsLoading(false);

        form.reset();
        toast.error("Login failed", {
          description: "Email or password is incorrect",
        });
      }
    } catch (e: unknown) {
      setIsLoading(false);

      console.log("Login failed", e);
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      {...field}
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your email"
                      required
                      {...field}
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
