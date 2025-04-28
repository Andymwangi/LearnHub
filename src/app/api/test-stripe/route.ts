import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // For testing purposes only
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Test data
    const userId = "test-user-id";
    const courseId = "test-course-id";
    const courseTitle = "Test Course";
    const price = 2999; // $29.99
    
    // Create a mock PayPal order ID
    const orderID = `PAY-${Math.random().toString(36).substring(2, 15)}`;
    
    // Store order information in database
    await db.paymentRecord.create({
      data: {
        userId,
        courseId,
        provider: "paypal",
        amount: price,
        currency: "USD",
        transactionId: orderID,
        status: "pending",
        metadata: {
          orderType: "test",
          courseTitle
        }
      }
    });
    
    return NextResponse.json({ 
      orderID,
      message: "Test PayPal order created successfully" 
    });
  } catch (error) {
    console.error("[TEST_PAYPAL_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create test PayPal order" },
      { status: 500 }
    );
  }
} 