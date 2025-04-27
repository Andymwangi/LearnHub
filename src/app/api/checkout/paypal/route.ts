import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { createPayPalOrder } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { courseId, courseTitle, price } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Check if the course exists
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if user already purchased this course
    const existingPurchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        }
      }
    });

    if (existingPurchase) {
      return NextResponse.json(
        { error: "You already own this course" },
        { status: 400 }
      );
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    // Use the course price if provided price is missing
    const finalPrice = price || course.price || 0;
    
    // Create the actual PayPal order
    const order = await createPayPalOrder({
      courseId,
      courseTitle: courseTitle || course.title,
      price: finalPrice,
      currency: "KES", // Will be converted to USD by the PayPal utility
      successUrl: `${origin}/api/checkout/paypal/success?courseId=${courseId}`,
      cancelUrl: `${origin}/courses/${courseId}?cancelled=true`,
    });
    
    // Find the approval URL
    const approvalUrl = order.links.find((link: any) => link.rel === "approve")?.href;
    
    if (!approvalUrl) {
      throw new Error("PayPal approval URL not found");
    }
    
    return NextResponse.json({ 
      approvalUrl,
      orderId: order.id
    });
    
  } catch (error) {
    console.error("[PAYPAL_CHECKOUT_ERROR]", error);
    return NextResponse.json(
      { error: "Payment processing failed. Please try again." },
      { status: 500 }
    );
  }
} 