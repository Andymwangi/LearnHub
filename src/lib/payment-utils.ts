import { db } from "@/lib/db";

/**
 * Records a payment attempt in the database
 */
export async function recordPaymentAttempt(data: {
  userId: string;
  courseId: string;
  provider: string;
  amount: number;
  currency: string;
  paymentIntent?: string;
  status: "pending" | "completed" | "failed";
  metadata?: Record<string, any>;
}) {
  try {
    // In a production system, you'd have a PaymentAttempt model
    // This is just for demonstration
    console.log("Recording payment attempt:", {
      ...data,
      timestamp: new Date().toISOString(),
    });
    
    // For demo purposes only - in real implementation you would store this info
    return {
      id: `payment_${Date.now()}`,
      ...data,
    };
  } catch (error) {
    console.error("Error recording payment attempt:", error);
    throw error;
  }
}

/**
 * Handles errors during payment processing
 */
export function handlePaymentError(error: any, userId: string, courseId: string) {
  // Log the error
  console.error("Payment processing error:", error);
  
  // Record the failed attempt
  recordPaymentAttempt({
    userId,
    courseId,
    provider: "paypal",
    amount: 0, // Unknown amount due to error
    currency: "KES",
    status: "failed",
    metadata: {
      error: error.message || "Unknown error",
      timestamp: new Date().toISOString(),
    },
  });
  
  // Return appropriate error message
  if (error.response && error.response.data) {
    return error.response.data.message || "Payment processing failed";
  }
  
  return "An error occurred during payment processing";
}

/**
 * Formats a price for display with currency symbol
 */
export function formatPrice(amount: number, currency: string = "KES") {
  if (!amount && amount !== 0) return "";
  
  // For KES, display as whole numbers without decimals
  if (currency === "KES") {
    const formatter = new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    return formatter.format(amount);
  }
  
  // For other currencies, use standard formatting
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  });
  
  return formatter.format(amount);
}

/**
 * Determines if a payment method is available for a given currency
 */
export function isPaymentMethodAvailable(method: string, currency: string = "KES") {
  const availableMethods: Record<string, string[]> = {
    paypal: ["USD", "EUR", "GBP", "CAD", "AUD", "KES"], // KES via conversion
    mpesa: ["KES"],
    card: ["USD", "EUR", "GBP", "KES"],
  };
  
  return availableMethods[method]?.includes(currency) || false;
} 