"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="mx-auto max-w-md space-y-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            A sign in link has been sent to your email address.
            Please check your inbox (and spam folder) and click the link to sign in.
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            The link will expire in 24 hours. If you don't see the email, you can request a new one.
          </p>
          
          <Button asChild variant="secondary">
            <Link href="/sign-in">Return to sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 