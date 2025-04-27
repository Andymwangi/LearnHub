"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/payment-utils";

interface PayPalButtonProps {
  courseId: string;
  courseTitle: string;
  price: number;
  disabled?: boolean;
}

export const PayPalButton = ({
  courseId,
  courseTitle,
  price,
  disabled = false
}: PayPalButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { toast, error } = useToast();

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      // Create PayPal order
      const { data: order } = await axios.post('/api/paypal/create-order', {
        courseId,
        courseTitle,
        price,
        currency: "KES", // Explicitly set to KES for Kenyan Shillings
        successUrl: `${window.location.origin}/dashboard/courses/confirmation?courseId=${courseId}`,
        cancelUrl: `${window.location.origin}/dashboard/cart`,
      });
      
      if (!order || !order.id) {
        throw new Error("Failed to create PayPal order");
      }
      
      // Find the approval URL in the links array
      const approvalLink = order.links?.find((link: any) => link.rel === "approve");
      
      if (!approvalLink || !approvalLink.href) {
        throw new Error("PayPal approval URL not found");
      }
      
      // Redirect to PayPal checkout
      window.location.href = approvalLink.href;
      
    } catch (err: any) {
      console.error("PayPal payment error:", err);
      
      // Extract error message from response if available
      let errorMsg = "Payment initiation failed. Please try again later.";
      
      if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setErrorMessage(errorMsg);
      error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handlePayment}
        disabled={disabled || isLoading}
        className="w-full bg-[#0070ba] hover:bg-[#003087] text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay with PayPal (${formatPrice(price, "KES")})`
        )}
      </Button>
      
      {errorMessage && (
        <p className="text-sm text-destructive mt-1">{errorMessage}</p>
      )}
      
      <p className="text-xs text-muted-foreground text-center mt-2">
        Secure payment processed in USD. You'll be redirected to PayPal to complete your purchase.
      </p>
    </div>
  );
};