import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendCourseEnrollmentEmail } from "@/lib/email";

// Handles enrollment after a successful payment
export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { courseId } = params;
    const { paymentProvider, paymentId } = await req.json();
    
    // Check if the course exists
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          }
        }
      }
    });
    
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    
    // Check if the user is already enrolled
    const existingPurchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        }
      }
    });
    
    if (existingPurchase) {
      return NextResponse.json({ error: "Already enrolled" }, { status: 400 });
    }
    
    // Create the purchase record to enroll the user
    const purchase = await db.purchase.create({
      data: {
        userId: session.user.id,
        courseId,
      }
    });
    
    // For each chapter in the course, create a UserProgress entry
    if (course.chapters.length > 0) {
      await db.userProgress.createMany({
        data: course.chapters.map((chapter: { id: string }) => ({
          userId: session.user.id,
          chapterId: chapter.id,
        }))
      });
    }
    
    // Get user's name for the email
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true }
    });
    
    // Send enrollment confirmation email
    if (user?.email) {
      await sendCourseEnrollmentEmail(
        user.name || "Student",
        user.email,
        course.title,
        courseId
      );
    }
    
    return NextResponse.json({ success: true, purchase });
    
  } catch (error) {
    console.error("[COURSE_ENROLL_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 