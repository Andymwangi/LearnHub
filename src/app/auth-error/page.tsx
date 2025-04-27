"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // Define error messages for different error types
  const getErrorMessage = () => {
    switch (error) {
      case "Verification":
        return "The verification link you used is invalid or has expired. Please request a new sign-in link.";
      case "Callback":
        return "There was a problem with the authentication process. This could be due to an expired session or an invalid link.";
      case "AccessDenied":
        return "You don't have permission to access this resource. Please sign in with an account that has the required permissions.";
      case "Configuration":
        return "There is a problem with the authentication configuration. Please contact support.";
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
      case "EmailCreateAccount":
      case "CredentialsSignin":
        return "There was a problem with the sign-in process. Please try again.";
      default:
        return "An unknown authentication error occurred. Please try signing in again.";
    }
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="mx-auto max-w-md space-y-6 p-6">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="mt-4 text-3xl font-bold">Authentication Error</h1>
          <p className="mt-2 text-muted-foreground">
            {getErrorMessage()}
          </p>
        </div>
        
        <div className="flex flex-col space-y-4">
          <Button asChild>
            <Link href="/sign-in">Sign in again</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go to homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 