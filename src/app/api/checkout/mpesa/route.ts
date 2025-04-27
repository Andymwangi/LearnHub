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
    const { courseId, courseTitle, price, phoneNumber } = body;
    
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
    
    // For now, create a checkout page where user can enter their phone number
    // In production, you'll integrate with M-PESA STK Push API
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const checkoutUrl = `${origin}/checkout/mpesa?courseId=${courseId}`;
    
    // Store the checkout information in the database for later reference
    await db.paymentRecord.create({
      data: {
        userId: session.user.id,
        courseId,
        provider: "mpesa",
        amount: price || course.price || 0,
        currency: "KES",
        status: "pending",
        metadata: {
          courseTitle: courseTitle || course.title,
          timestamp: new Date().toISOString()
        }
      }
    });
    
    return NextResponse.json({ 
      checkoutUrl,
      message: "Redirecting to M-PESA checkout page"
    });
  } catch (error) {
    console.error("[MPESA_CHECKOUT_ERROR]", error);
    return NextResponse.json(
      { error: "Payment processing failed. Please try again." },
      { status: 500 }
    );
  }
} 