import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

// GET chapters for a course with access control
export async function GET(
  req: NextRequest, 
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    const session = await getServerSession(authOptions);
    
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }
    
    // Check if the course exists and is published
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        chapters: {
          where: {
            isPublished: true,
          },
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            title: true,
            description: true,
            position: true,
            isFree: true,
            videoUrl: true,
          },
        },
      },
    });
    
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }
    
    // Check if the user has purchased this course
    let hasPurchased = false;
    
    if (session?.user?.id) {
      const purchase = await db.purchase.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId,
          },
        },
      });
      
      if (purchase) {
        hasPurchased = true;
      }
    }
    
    // Process chapters based on access rights
    const chapters = course.chapters.map((chapter: {
      id: string;
      title: string;
      description: string;
      position: number;
      isFree: boolean;
      videoUrl: string | null;
    }, index: number) => {
      // First chapter is always accessible (changed from first two)
      // Users who purchased the course can access all chapters
      // Chapters marked as free are accessible to everyone
      const isAccessible = index < 1 || hasPurchased || chapter.isFree;
      
      return {
        ...chapter,
        isAccessible,
        // Only send the videoUrl if the chapter is accessible
        videoUrl: isAccessible ? chapter.videoUrl : null,
      };
    });
    
    return NextResponse.json({
      courseTitle: course.title,
      chapters,
      hasPurchased,
    });
    
  } catch (error) {
    console.error("[COURSE_CHAPTERS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 