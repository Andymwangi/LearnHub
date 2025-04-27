import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { courseId, chapterId } = params;
    const session = await getServerSession(authOptions);

    if (!courseId || !chapterId) {
      return NextResponse.json(
        { error: "Course ID and Chapter ID are required" },
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
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Get the specific chapter
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
        courseId: courseId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        videoUrl: true,
        position: true,
        isFree: true,
      },
    });

    if (!chapter) {
      return NextResponse.json(
        { error: "Chapter not found" },
        { status: 404 }
      );
    }

    // Check if user has purchased the course
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

    // Get all published chapters in order to determine position
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      orderBy: {
        position: "asc"
      },
      select: {
        id: true,
        position: true,
      }
    });

    // Find index of current chapter in the published chapters list
    const chapterIndex = publishedChapters.findIndex(
      (ch: { id: string }) => ch.id === chapterId
    );

    // Check access rights:
    // 1. First chapter is accessible without purchase
    // 2. Users who purchased the course can access all chapters
    // 3. Chapters marked as free are accessible to everyone
    const isAccessible = chapterIndex < 1 || hasPurchased || chapter.isFree;

    if (!isAccessible) {
      return NextResponse.json(
        { error: "You must purchase this course to access this chapter" },
        { status: 403 }
      );
    }

    // Get previous and next chapters
    const previousChapter = publishedChapters[chapterIndex - 1] || null;
    const nextChapter = publishedChapters[chapterIndex + 1] || null;

    // Get user progress if logged in
    let userProgress = null;
    if (session?.user?.id) {
      userProgress = await db.userProgress.findUnique({
        where: {
          userId_chapterId: {
            userId: session.user.id,
            chapterId,
          },
        },
      });
    }

    return NextResponse.json({
      chapter,
      course: { id: course.id, title: course.title },
      chapterIndex,
      totalChapters: publishedChapters.length,
      nextChapter: nextChapter ? { id: nextChapter.id } : null,
      previousChapter: previousChapter ? { id: previousChapter.id } : null,
      userProgress,
      hasPurchased,
    });

  } catch (error) {
    console.error("[CHAPTER_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 