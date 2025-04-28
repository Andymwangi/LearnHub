import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { sendCourseEnrollmentEmail } from "@/lib/email";

const checkoutSchema = z.object({
  courseId: z.string().uuid(),
  returnUrl: z.string().url().optional(),
  paymentMethod: z.enum(["paypal", "mpesa"]).optional(),
});

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
    const validation = checkoutSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    const { courseId, returnUrl, paymentMethod = "paypal" } = validation.data;

    // Check if the user already has access to this course
    const existingPurchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (existingPurchase) {
      return NextResponse.json(
        { error: "You already have access to this course" },
        { status: 400 }
      );
    }

    // Get course details
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found or not available" },
        { status: 404 }
      );
    }

    // Free courses don't need checkout
    if (!course.price || course.price === 0) {
      await db.purchase.create({
        data: {
          userId: session.user.id,
          courseId: course.id,
        }
      });

      // Send enrollment email for free courses
      if (session.user.email) {
        await sendCourseEnrollmentEmail(
          session.user.name || "Student",
          session.user.email,
          course.title,
          course.id
        );
      }

      return NextResponse.json({ 
        success: true, 
        url: returnUrl || `/dashboard/courses/${courseId}` 
      });
    }

    // Get hostname for URLs
    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    const successUrl = `${origin}/dashboard/courses/${courseId}?success=1`;
    const cancelUrl = returnUrl || `${origin}/courses/${courseId}?canceled=1`;

    // Record the payment intent
    const paymentRecord = await db.paymentRecord.create({
      data: {
        userId: session.user.id,
        courseId: course.id,
        provider: paymentMethod,
        amount: course.price,
        currency: "KES",
        status: "pending",
        metadata: {
          courseTitle: course.title
        }
      }
    });

    // Redirect to appropriate payment page based on selected method
    if (paymentMethod === "mpesa") {
      return NextResponse.json({ 
        url: `/payment/mpesa?recordId=${paymentRecord.id}&courseId=${courseId}` 
      });
    } else {
      // Default to PayPal
      return NextResponse.json({ 
        url: `/payment/paypal?recordId=${paymentRecord.id}&courseId=${courseId}` 
      });
    }
  } catch (error) {
    console.error("[CHECKOUT_POST]", error);
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    );
  }
}

// Handle successful payments
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");
  const success = searchParams.get("success");
  const paymentId = searchParams.get("paymentId");
  
  if (!courseId || success !== "1") {
    return NextResponse.json(
      { error: "Invalid parameters" },
      { status: 400 }
    );
  }
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Update the payment record if paymentId is provided
    if (paymentId) {
      await db.paymentRecord.update({
        where: { id: paymentId },
        data: { status: "completed" }
      });
    }
    
    // Record purchase success
    const purchase = await db.purchase.create({
      data: {
        userId: session.user.id,
        courseId,
      }
    });
    
    // Get course details for the email
    const course = await db.course.findUnique({
      where: { id: courseId }
    });

    // Send enrollment confirmation email
    if (session.user.email && course) {
      await sendCourseEnrollmentEmail(
        session.user.name || "Student",
        session.user.email,
        course.title,
        course.id
      );
    }
    
    return NextResponse.json({ success: true, purchase });
  } catch (error) {
    console.error("[CHECKOUT_SUCCESS]", error);
    return NextResponse.json(
      { error: "Failed to record purchase" },
      { status: 500 }
    );
  }
} 