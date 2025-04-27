"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AtSign, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.enum(["STUDENT", "TEACHER", "ADMIN"], {
    required_error: "Please select a role",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignUp() {
  const router = useRouter();
  const { toast, success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "STUDENT",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Then send the magic link
      let callbackUrl = "/dashboard";
      
      // First create the user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          role: data.role,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create account');
      }
      
      // Check if user already exists and handle appropriately
      const responseData = await response.json();
      
      // Set different callback URLs based on role
      // If user exists, use their existing role for redirection
      if (responseData.exists) {
        if (responseData.role === "TEACHER") {
          callbackUrl = "/dashboard/teacher";
        } else if (responseData.role === "ADMIN") {
          callbackUrl = "/dashboard/admin";
        }
        // Notify user that account already exists
        toast("Account already exists");
      } else {
        // For new users, use the role they selected
        if (data.role === "TEACHER") {
          callbackUrl = "/dashboard/teacher";
        } else if (data.role === "ADMIN") {
          callbackUrl = "/dashboard/admin";
        }
        // Notify user that account was created
        success("Account created! Check your email for a sign-in link.");
      }
      
      const result = await signIn("email", {
        email: data.email,
        redirect: false,
        callbackUrl
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      setLinkSent(true);
    } catch (err: any) {
      error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (linkSent) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            We've created your account and sent you a magic link to sign in. Please check your inbox and click the link to continue.
          </p>
        </div>
        <div className="text-sm text-center text-muted-foreground">
          Didn't receive an email? Check your spam folder or{" "}
          <button 
            onClick={() => setLinkSent(false)} 
            className="text-primary underline"
          >
            try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-muted-foreground">
          Enter your information below to create your account
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Name
          </label>
          <div className="relative">
            <div className="absolute left-3 top-2.5 text-muted-foreground">
              <User className="h-5 w-5" />
            </div>
            <Input
              {...register("name")}
              className="pl-10"
              placeholder="Your name"
              disabled={isLoading}
            />
          </div>
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-3 top-2.5 text-muted-foreground">
              <AtSign className="h-5 w-5" />
            </div>
            <Input
              {...register("email")}
              className="pl-10"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            I am a...
          </label>
          <Select 
            defaultValue="STUDENT" 
            onValueChange={(value) => setValue("role", value as "STUDENT" | "TEACHER" | "ADMIN")}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STUDENT">Student</SelectItem>
              <SelectItem value="TEACHER">Teacher</SelectItem>
              <SelectItem value="ADMIN">Administrator</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-sm text-destructive">{errors.role.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary font-medium underline underline-offset-4 hover:text-primary/90">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
} 