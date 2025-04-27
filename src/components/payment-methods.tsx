"use client";

import { useState } from "react";
import axios from "axios";
import { CreditCard, Loader2, CircleDollarSign, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethodsProps {
  courseId: string;
  courseTitle: string;
  price?: number;
}

export function PaymentMethods({ 
  courseId, 
  courseTitle,
  price = 0 
}: PaymentMethodsProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleStripePayment = async () => {
    try {
      setIsLoading("stripe");
      
      const response = await axios.post("/api/checkout", {
        courseId,
        paymentMethod: "stripe"
      });
      
      window.location.href = response.data.url;
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong");
      setIsLoading(null);
    }
  };

  const handlePaypalPayment = async () => {
    try {
      setIsLoading("paypal");
      
      // Initialize PayPal payment
      const response = await axios.post("/api/checkout/paypal", {
        courseId,
        courseTitle,
        price
      });
      
      // If successful, redirect to PayPal checkout URL
      if (response.data.approvalUrl) {
        window.location.href = response.data.approvalUrl;
      } else {
        throw new Error("Failed to create PayPal payment");
      }
    } catch (error: any) {
      console.error("PayPal payment error:", error);
      toast.error(error.response?.data?.error || "Failed to process PayPal payment");
      setIsLoading(null);
    }
  };

  const handleMpesaPayment = async () => {
    try {
      setIsLoading("mpesa");
      
      // Initialize M-PESA payment (this endpoint would need to be implemented)
      const response = await axios.post("/api/checkout/mpesa", {
        courseId,
        courseTitle,
        price
      });
      
      // M-PESA typically requires a phone number input and sends a prompt
      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        throw new Error("Failed to initiate M-PESA payment");
      }
    } catch (error: any) {
      console.error("M-PESA payment error:", error);
      toast.error(error.response?.data?.error || "Failed to process M-PESA payment");
      setIsLoading(null);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsLoading("cart");
      
      // Add the course to the cart
      await axios.post("/api/cart", {
        courseId
      });
      
      toast.success(`${courseTitle} added to cart`);
      setIsLoading(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to add to cart";
      toast.error(errorMessage);
      setIsLoading(null);
    }
  };

  // Format price with KES currency - use the formatPrice function for consistency
  const formatKesPrice = formatPrice;

  return (
    <div className="space-y-4">
      <div className="font-semibold text-xl mb-2">
        {price > 0 ? formatPrice(price) : "Free"}
      </div>
      
      {price > 0 && (
        <>
          <Button 
            onClick={handleStripePayment}
            disabled={!!isLoading}
            className="w-full"
          >
            {isLoading === "stripe" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay with Card
              </>
            )}
          </Button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          
          <Button 
            onClick={handleMpesaPayment}
            disabled={!!isLoading}
            className="w-full bg-[#4caf50] hover:bg-[#388e3c] text-white"
            variant="outline"
          >
            {isLoading === "mpesa" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CircleDollarSign className="h-4 w-4 mr-2" />
                Pay with M-PESA
              </>
            )}
          </Button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          
          <Button 
            onClick={handlePaypalPayment}
            disabled={!!isLoading}
            className="w-full bg-[#0070ba] hover:bg-[#003087] text-white"
            variant="outline"
          >
            {isLoading === "paypal" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CircleDollarSign className="h-4 w-4 mr-2" />
                Pay with PayPal
              </>
            )}
          </Button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            disabled={!!isLoading}
            variant="secondary"
            className="w-full bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary"
          >
            {isLoading === "cart" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding to cart...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </>
      )}
      
      {price === 0 && (
        <Button className="w-full">
          Enroll for Free
        </Button>
      )}
      
      <p className="text-xs text-center text-muted-foreground mt-2">
        30-Day Money-Back Guarantee
      </p>
    </div>
  );
} 