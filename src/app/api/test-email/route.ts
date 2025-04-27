import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    // Get test data from request
    const { name, email } = await req.json();
    
    // Validate inputs
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }
    
    // Send test welcome email
    const result = await sendWelcomeEmail(name, email);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully",
        messageId: result.messageId
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to send email",
          details: result.error
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[TEST_EMAIL_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 