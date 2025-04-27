"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function PaymentConfirmationPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [courseId, setCourseId] = useState<string | null>(null);
  const [courseName, setCourseName] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error } = useToast();
  
  // Get PayPal parameters from URL
  const token = searchParams.get("token");
  const paymentId = searchParams.get("paymentId");
  const PayerID = searchParams.get("PayerID");
  const courseIdParam = searchParams.get("courseId");

  useEffect(() => {
    async function verifyPayment() {
      if (!token || !PayerID) {
        setStatus("error");
        return;
      }

      try {
        // Capture the payment
        const { data } = await axios.post("/api/paypal/capture", {
          orderId: token,
          PayerID: PayerID,
          courseId: courseIdParam
        });

        if (data.success) {
          setCourseId(data.courseId);
          setCourseName(data.courseName || "the course");
          setStatus("success");
          
          success("You have been enrolled in the course!");
        } else {
          setStatus("error");
          error(data.message || "There was an error processing your payment.");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setStatus("error");
        error("There was an error processing your payment.");
      }
    }

    verifyPayment();
  }, [token, PayerID, courseIdParam, success, error]);

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {status === "loading" && "Processing Payment..."}
            {status === "success" && "Payment Successful!"}
            {status === "error" && "Payment Failed"}
          </CardTitle>
          <CardDescription className="text-center">
            {status === "loading" && "Please wait while we verify your payment..."}
            {status === "success" && `You have successfully enrolled in ${courseName}.`}
            {status === "error" && "There was an error processing your payment."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          {status === "loading" && <Loader2 className="h-16 w-16 text-primary animate-spin" />}
          {status === "success" && <CheckCircle className="h-16 w-16 text-success" />}
          {status === "error" && <AlertCircle className="h-16 w-16 text-destructive" />}
        </CardContent>
        <CardFooter className="flex justify-center space-x-2">
          {status === "success" && (
            <Button onClick={() => router.push(`/dashboard/courses/${courseId}`)}>
              Go to Course
            </Button>
          )}
          {status === "error" && (
            <Button onClick={() => router.push("/dashboard/cart")}>
              Return to Cart
            </Button>
          )}
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 