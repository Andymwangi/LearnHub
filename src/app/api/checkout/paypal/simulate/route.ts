import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendCourseEnrollmentEmail } from "@/lib/email";
import { redirect } from "next/navigation";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// This endpoint simulates a PayPal payment flow
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }
    
    // Get URL parameters
    const url = new URL(req.url);
    const courseId = url.searchParams.get("course_id");
    const userId = url.searchParams.get("user_id");
    const returnUrl = url.searchParams.get("return_url");
    
    if (!courseId || !userId || !returnUrl) {
      return new Response("Missing required parameters", { status: 400 });
    }
    
    // Verify the user ID matches the session ID
    if (userId !== session.user.id) {
      return new Response("Invalid user ID", { status: 403 });
    }
    
    // Get the course
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });
    
    if (!course) {
      return new Response("Course not found", { status: 404 });
    }
    
    // Simulate payment processing - in real implementation this would be handled by PayPal webhook
    // Check if the user already has a purchase for this course
    const existingPurchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        }
      }
    });
    
    if (!existingPurchase) {
      // Create the purchase record
      await db.purchase.create({
        data: {
          userId: session.user.id,
          courseId,
        }
      });
      
      // Create user progress records for each chapter
      const chapters = await db.chapter.findMany({
        where: {
          courseId,
          isPublished: true,
        },
        select: {
          id: true,
        }
      });
      
      if (chapters.length > 0) {
        await db.userProgress.createMany({
          data: chapters.map((chapter: { id: string }) => ({
            userId: session.user.id,
            chapterId: chapter.id,
          }))
        });
      }
      
      // Send confirmation email
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true }
      });
      
      if (user?.email) {
        await sendCourseEnrollmentEmail(
          user.name || "Student",
          user.email,
          course.title,
          courseId
        );
      }
    }
    
    // HTML for a simple payment confirmation page with a redirect
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Payment Processing</title>
          <meta http-equiv="refresh" content="3;url=${returnUrl}" />
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              background-color: #f0f0f0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .container {
              background-color: white;
              border-radius: 8px;
              padding: 2rem;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              text-align: center;
              max-width: 500px;
            }
            h1 {
              color: #0070ba;
              margin-top: 0;
            }
            .loader {
              border: 4px solid #f3f3f3;
              border-radius: 50%;
              border-top: 4px solid #0070ba;
              width: 40px;
              height: 40px;
              margin: 1.5rem auto;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Payment Successful!</h1>
            <p>Thank you for your purchase. Your course enrollment has been processed.</p>
            <div class="loader"></div>
            <p>Redirecting you back to the course...</p>
          </div>
        </body>
      </html>`,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
    
  } catch (error) {
    console.error("[PAYPAL_SIMULATE_ERROR]", error);
    return new Response("Internal server error", { status: 500 });
  }
} 