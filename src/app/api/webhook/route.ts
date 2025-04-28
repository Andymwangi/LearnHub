import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { sendCourseEnrollmentEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const headersList = headers();
    const provider = headersList.get("X-Payment-Provider"); // "paypal" or "mpesa"
    
    if (!provider) {
      return NextResponse.json(
        { error: "Missing payment provider information" },
        { status: 400 }
      );
    }

    // Process PayPal webhooks
    if (provider === "paypal") {
      return handlePayPalWebhook(body);
    } 
    
    // Process M-PESA webhooks
    if (provider === "mpesa") {
      return handleMpesaWebhook(body);
    }

    return NextResponse.json(
      { error: "Unsupported payment provider" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[WEBHOOK_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handlePayPalWebhook(payload: any) {
  // Verify PayPal webhook signature would go here
  
  // Process the PayPal event
  const event_type = payload.event_type;
  
  if (event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const paymentId = payload.resource.custom_id; // We'll store our record ID here
    
    // Find the payment record
    const payment = await db.paymentRecord.findUnique({
      where: { transactionId: payload.resource.id }
    });
    
    if (!payment) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }
    
    // Get course details separately
    const course = await db.course.findUnique({
      where: { id: payment.courseId }
    });
    
    // Update payment status
    await db.paymentRecord.update({
      where: { id: payment.id },
      data: { status: "completed" }
    });
    
    // Create purchase record
    await db.purchase.create({
      data: {
        userId: payment.userId,
        courseId: payment.courseId
      }
    });
    
    // Get user details for email
    const user = await db.user.findUnique({
      where: { id: payment.userId }
    });
    
    // Send enrollment confirmation email
    if (user?.email && course) {
      await sendCourseEnrollmentEmail(
        user.name || "Student",
        user.email,
        course.title,
        payment.courseId
      );
    }
  }
  
  return NextResponse.json({ received: true });
}

async function handleMpesaWebhook(payload: any) {
  // Process the M-PESA callback
  const resultCode = payload.Body.stkCallback?.ResultCode;
  const merchantRequestId = payload.Body.stkCallback?.MerchantRequestID;
  
  // Find the payment record using metadata
  const payment = await db.paymentRecord.findFirst({
    where: {
      metadata: {
        path: ["mpesa_merchant_request_id"],
        equals: merchantRequestId
      }
    }
  });
  
  if (!payment) {
    return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
  }
  
  // Get course details separately
  const course = await db.course.findUnique({
    where: { id: payment.courseId }
  });
  
  // If payment is successful
  if (resultCode === 0) {
    // Update payment status
    await db.paymentRecord.update({
      where: { id: payment.id },
      data: { status: "completed" }
    });
    
    // Create purchase record
    await db.purchase.create({
      data: {
        userId: payment.userId,
        courseId: payment.courseId
      }
    });
    
    // Get user details for email
    const user = await db.user.findUnique({
      where: { id: payment.userId }
    });
    
    // Send enrollment confirmation email
    if (user?.email && course) {
      await sendCourseEnrollmentEmail(
        user.name || "Student",
        user.email,
        course.title,
        payment.courseId
      );
    }
  } else {
    // Update payment status to failed
    await db.paymentRecord.update({
      where: { id: payment.id },
      data: { 
        status: "failed",
        metadata: {
          ...(payment.metadata as Record<string, any> || {}),
          failure_reason: payload.Body.stkCallback?.ResultDesc
        }
      }
    });
  }
  
  return NextResponse.json({ received: true });
} 