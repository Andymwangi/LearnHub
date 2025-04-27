import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import axios from "axios";

// Constants for M-PESA API
const MPESA_AUTH_URL = process.env.MPESA_AUTH_URL || "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
const MPESA_EXPRESS_URL = process.env.MPESA_EXPRESS_URL || "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || "";
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || "";
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || "";
const MPESA_PASSKEY = process.env.MPESA_PASSKEY || "";
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || "";

/**
 * Get M-PESA access token
 */
async function getMpesaAccessToken() {
  try {
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64");
    
    const response = await axios.get(MPESA_AUTH_URL, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting M-PESA access token:", error);
    throw new Error("Failed to authenticate with M-PESA");
  }
}

/**
 * Generate timestamp for M-PESA
 */
function getTimestamp() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  
  return `${year}${month}${day}${hour}${minute}${second}`;
}

/**
 * Generate password for M-PESA
 */
function generatePassword(timestamp: string) {
  const passString = `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`;
  return Buffer.from(passString).toString("base64");
}

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
    const { courseId, phoneNumber, amount } = body;
    
    if (!courseId || !phoneNumber) {
      return NextResponse.json(
        { error: "Course ID and phone number are required" },
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
    
    // Use the provided amount or fall back to course price
    const paymentAmount = amount || course.price || 0;
    
    // Create a unique checkout ID for tracking
    const checkoutId = `${Date.now()}-${session.user.id.substring(0, 8)}`;
    
    try {
      // Get M-PESA access token
      const accessToken = await getMpesaAccessToken();
      
      // Prepare STK Push request
      const timestamp = getTimestamp();
      const password = generatePassword(timestamp);
      
      // Format amount to whole number for M-PESA
      const formattedAmount = Math.ceil(paymentAmount);
      
      // In a real implementation, this would call the M-PESA API
      // For demonstration purposes, we're mocking the response
      
      // Record the pending payment in database
      await db.paymentRecord.create({
        data: {
          userId: session.user.id,
          courseId,
          provider: "mpesa",
          amount: paymentAmount,
          currency: "KES",
          status: "initiated",
          transactionId: checkoutId,
          metadata: {
            phoneNumber,
            timestamp: new Date().toISOString(),
            courseTitle: course.title
          }
        }
      });
      
      // In production, you would make the real API call:
      /*
      const response = await axios.post(
        MPESA_EXPRESS_URL,
        {
          BusinessShortCode: MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: formattedAmount,
          PartyA: phoneNumber,
          PartyB: MPESA_SHORTCODE,
          PhoneNumber: phoneNumber,
          CallBackURL: `${MPESA_CALLBACK_URL}?checkoutId=${checkoutId}`,
          AccountReference: `LearnHub-${course.id.substring(0, 8)}`,
          TransactionDesc: `Payment for ${course.title}`,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      // Process the response from M-PESA
      const { CheckoutRequestID, ResponseCode, ResponseDescription } = response.data;
      
      if (ResponseCode !== "0") {
        throw new Error(`M-PESA Error: ${ResponseDescription}`);
      }
      */
      
      // Simulated response for demonstration
      return NextResponse.json({
        success: true,
        message: "Payment request sent to your phone",
        checkoutId,
        // In production, you would include the actual response details
        // checkoutRequestId: CheckoutRequestID
      });
      
    } catch (error: any) {
      console.error("M-PESA STK Push error:", error);
      
      // Update payment record to show failure
      await db.paymentRecord.update({
        where: { transactionId: checkoutId },
        data: { 
          status: "failed",
          metadata: {
            error: error.message || "Unknown error",
            timestamp: new Date().toISOString()
          }
        }
      });
      
      return NextResponse.json(
        { error: "Failed to initiate payment. Please try again." },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error("[MPESA_STK_ERROR]", error);
    return NextResponse.json(
      { error: "Payment processing failed. Please try again." },
      { status: 500 }
    );
  }
} 