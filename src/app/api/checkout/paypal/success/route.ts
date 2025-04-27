import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { capturePayPalPayment, validatePayPalPayment } from "@/lib/paypal";
import { sendCourseEnrollmentEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Extract parameters
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const paypalOrderId = searchParams.get("token"); // PayPal passes the order ID as 'token'
    
    if (!courseId || !paypalOrderId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }
    
    // Check if the course exists
    const course = await db.course.findUnique({
      where: { 
        id: courseId,
        isPublished: true
      }
    });
    
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }
    
    // Check if already purchased
    const existingPurchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId
        }
      }
    });
    
    if (existingPurchase) {
      // Already purchased, redirect to course page
      return NextResponse.redirect(
        new URL(`/dashboard/courses/${courseId}`, req.url)
      );
    }
    
    // Validate and capture the PayPal payment
    const validationResult = await validatePayPalPayment(paypalOrderId);
    
    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: "Payment validation failed" },
        { status: 400 }
      );
    }
    
    // Capture the payment
    const captureResult = await capturePayPalPayment(paypalOrderId);
    
    // Record the purchase
    const purchase = await db.purchase.create({
      data: {
        userId: session.user.id,
        courseId
      }
    });
    
    // Send enrollment email
    if (session.user.email) {
      await sendCourseEnrollmentEmail(
        session.user.name || "Student",
        session.user.email,
        course.title,
        courseId
      );
    }
    
    // Record the payment details (optional, for record keeping)
    const paymentAmount = captureResult.purchase_units[0]?.payments?.captures[0]?.amount?.value || "0";
    const paymentCurrency = captureResult.purchase_units[0]?.payments?.captures[0]?.amount?.currency_code || "USD";
    
    await db.paymentRecord.create({
      data: {
        userId: session.user.id,
        courseId,
        provider: "paypal",
        amount: parseFloat(paymentAmount),
        currency: paymentCurrency,
        transactionId: captureResult.id,
        status: "completed",
        metadata: {
          paypalOrderId,
          captureDetails: JSON.stringify(captureResult)
        }
      }
    });
    
    // Redirect to the course page
    return NextResponse.redirect(
      new URL(`/dashboard/courses/${courseId}?success=true`, req.url)
    );
    
  } catch (error) {
    console.error("[PAYPAL_SUCCESS_ERROR]", error);
    
    // Create a URL for the error page
    const errorUrl = new URL("/dashboard/courses", req.url);
    errorUrl.searchParams.set("error", "payment");
    
    return NextResponse.redirect(errorUrl);
  }
} 