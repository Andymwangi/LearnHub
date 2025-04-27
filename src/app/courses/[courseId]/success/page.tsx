"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SuccessPageProps {
  params: {
    courseId: string;
  };
}

export default function SuccessPage({ params }: SuccessPageProps) {
  const { courseId } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider");

  useEffect(() => {
    // In a real app, we might verify the payment status here
    // For now we'll just assume the payment was successful
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-black/30 p-8 rounded-xl border border-white/10 max-w-lg w-full text-center text-white">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-300 mb-6">
          Thank you for your purchase. Your enrollment has been confirmed and you now have full access to all course content.
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={() => router.push(`/courses/${courseId}`)}
            className="w-full"
          >
            Go to Course
          </Button>
          
          <Button 
            onClick={() => router.push(`/courses/${courseId}/chapters`)}
            variant="outline"
            className="w-full border-white/20"
          >
            Start Learning
          </Button>
          
          <div className="pt-4 border-t border-white/10 mt-6 text-sm text-gray-400">
            Payment processed via {provider || "Stripe"}. 
            <br />
            Need help? <Link href="/support" className="text-primary hover:underline">Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 