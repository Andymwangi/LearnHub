import { NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { courseId, courseTitle, price, currency, successUrl, cancelUrl } = body;
    
    if (!courseId || !courseTitle || !price || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }
    
    // Check if the course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
    });
    
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }
    
    // Check if the user already purchased the course
    const existingPurchase = await db.purchase.findFirst({
      where: {
        userId: session.user.id,
        courseId,
      },
    });
    
    if (existingPurchase) {
      return NextResponse.json(
        { error: "You already own this course" },
        { status: 400 }
      );
    }
    
    // Create the PayPal order
    const order = await createPayPalOrder({
      courseId,
      courseTitle,
      price,
      currency: currency || "KES",
      successUrl,
      cancelUrl,
    });
    
    return NextResponse.json(order);
    
  } catch (error) {
    console.error("[PAYPAL_CREATE_ORDER_ERROR]", error);
    return NextResponse.json(
      { error: "An error occurred creating the order" },
      { status: 500 }
    );
  }
}