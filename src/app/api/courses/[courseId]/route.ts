import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

// GET a specific course by ID
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
    
    // Fetch the course with related data
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            bio: true,
            avatarUrl: true,
          }
        },
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
          }
        },
        _count: {
          select: {
            purchases: true,
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

    // Transform the data to match the expected client format
    const formattedCourse = {
      id: course.id,
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      price: course.price,
      isPublished: course.isPublished,
      categoryId: course.categoryId,
      category: course.category,
      students: course._count.purchases,
      rating: 4.7, // Mock rating data
      totalHours: course.chapters.length * 1.5, // Estimate hours based on chapter count
      instructor: {
        name: course.user.name,
        bio: course.user.bio,
        avatarUrl: course.user.avatarUrl,
      },
      chapters: course.chapters,
      hasPurchased,
    };

    return NextResponse.json(formattedCourse);
    
  } catch (error) {
    console.error("[COURSE_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 