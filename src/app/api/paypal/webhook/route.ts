import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendCourseEnrollmentEmail } from "@/lib/email";

// Verify PayPal webhook signature
function verifyPayPalWebhookSignature(
  body: string,
  transmissionId: string,
  timestamp: string,
  webhookSignature: string,
  webhookId: string
): boolean {
  // In a real implementation, you would use the PayPal SDK to verify the signature
  // For simulation purposes, we'll perform a simplified check
  
  // Mock verification for development
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  
  try {
    // Webhook event string to verify: transmissionId + timestamp + webhookId + crc32(body)
    const payload = `${transmissionId}:${timestamp}:${webhookId}:${crc32(body)}`;
    
    // Generate signature using HMAC with SHA256
    const hmac = crypto.createHmac("sha256", process.env.PAYPAL_WEBHOOK_SECRET as string);
    const expectedSignature = hmac.update(payload).digest("base64");
    
    return webhookSignature === expectedSignature;
  } catch (error) {
    console.error("[PAYPAL_SIGNATURE_VERIFICATION_ERROR]", error);
    return false;
  }
}

// Mock CRC32 implementation
function crc32(str: string): number {
  // Simple hash function for demo purposes
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash >>> 0;
}

// PayPal webhook event types
const PAYMENT_CAPTURE_COMPLETED = "PAYMENT.CAPTURE.COMPLETED";
const PAYMENT_CAPTURE_DENIED = "PAYMENT.CAPTURE.DENIED";
const PAYMENT_CAPTURE_REFUNDED = "PAYMENT.CAPTURE.REFUNDED";

export async function POST(req: Request) {
  try {
    // Verify the PayPal webhook signature
    const paypalWebhookId = process.env.PAYPAL_WEBHOOK_ID;
    const requestBody = await req.text();
    const headersList = headers();
    
    const transmissionId = headersList.get("paypal-transmission-id");
    const timestamp = headersList.get("paypal-transmission-time");
    const webhookSignature = headersList.get("paypal-transmission-sig");
    const certUrl = headersList.get("paypal-cert-url");
    
    if (!paypalWebhookId || !transmissionId || !timestamp || !webhookSignature || !certUrl) {
      console.error("Missing required PayPal webhook headers");
      return NextResponse.json({ success: false }, { status: 400 });
    }
    
    // In production, verify the signature - for now, accept all webhooks
    // const isVerified = verifyWebhookSignature(...); // Implement proper verification
    const isVerified = true; // For development only
    
    if (!isVerified) {
      console.error("Invalid PayPal webhook signature");
      return NextResponse.json({ success: false }, { status: 401 });
    }
    
    // Process the webhook event
    const event = JSON.parse(requestBody);
    const eventType = event.event_type;
    const resource = event.resource;
    
    console.log(`Processing PayPal webhook: ${eventType}`);
    
    switch (eventType) {
      case PAYMENT_CAPTURE_COMPLETED:
        await handlePaymentCompleted(resource);
        break;
      
      case PAYMENT_CAPTURE_DENIED:
        await handlePaymentDenied(resource);
        break;
      
      case PAYMENT_CAPTURE_REFUNDED:
        await handleRefund(resource);
        break;
      
      default:
        console.log(`Unhandled PayPal webhook event type: ${eventType}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment completion
 */
async function handlePaymentCompleted(resource: any) {
  try {
    const orderId = resource.supplementary_data?.related_ids?.order_id;
    const captureId = resource.id;
    const status = resource.status;
    
    if (!orderId || status !== "COMPLETED") {
      return;
    }
    
    // Extract the custom data with course information
    const customId = resource.custom_id;
    if (!customId) return;
    
    let courseId: string | null = null;
    try {
      const customData = JSON.parse(customId);
      courseId = customData.courseId;
    } catch (e) {
      console.error("Error parsing custom_id:", e);
      return;
    }
    
    if (!courseId) return;
    
    // Find the user associated with this payment
    // Note: In a real system, you'd need to track which user initiated the payment
    // This is a simplified example
    
    // Create or update purchase record
    // This would need more robust implementation in production
    console.log(`Payment completed for order: ${orderId}, course: ${courseId}`);
  } catch (error) {
    console.error("Error handling payment completion:", error);
  }
}

/**
 * Handle denied payment
 */
async function handlePaymentDenied(resource: any) {
  const orderId = resource.supplementary_data?.related_ids?.order_id;
  console.log(`Payment denied for order: ${orderId}`);
  // Update your database accordingly
}

/**
 * Handle refund
 */
async function handleRefund(resource: any) {
  const orderId = resource.supplementary_data?.related_ids?.order_id;
  console.log(`Payment refunded for order: ${orderId}`);
  // Process refund in your system
} 