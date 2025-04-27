import { NextResponse } from "next/server";
import { capturePayPalPayment, validatePayPalPayment } from "@/lib/paypal";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { orderId, PayerID, courseId } = await req.json();
    
    if (!orderId || !PayerID || !courseId) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 }
      );
    }
    
    // Capture the PayPal payment
    const captureData = await capturePayPalPayment(orderId);
    
    // Validate the captured payment
    const { isValid, orderData } = await validatePayPalPayment(orderId);
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Payment validation failed" },
        { status: 400 }
      );
    }
    
    // Extract data from the captured order
    const purchaseUnit = captureData.purchase_units[0];
    const amount = parseFloat(purchaseUnit.amount.value);
    const currency = purchaseUnit.amount.currency_code;
    
    // Get the course details
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, price: true }
    });
    
    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }
    
    // Check if the user is already enrolled
    const existingPurchase = await db.purchase.findFirst({
      where: {
        userId: session.user.id,
        courseId: courseId,
      },
    });
    
    if (existingPurchase) {
      return NextResponse.json({
        success: true,
        courseId: course.id,
        courseName: course.title,
        message: "You're already enrolled in this course",
      });
    }
    
    // Create a new purchase/enrollment
    const purchase = await db.purchase.create({
      data: {
        userId: session.user.id,
        courseId: courseId,
      },
    });
    
    return NextResponse.json({
      success: true,
      courseId: course.id,
      courseName: course.title,
      message: "Payment successful and enrollment completed",
    });
    
  } catch (error) {
    console.error("[PAYPAL_CAPTURE_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 