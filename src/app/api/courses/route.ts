import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

// Course creation schema
const courseCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  imageUrl: z.string().url().optional(),
  categoryId: z.string().optional(),
});

// Course update schema
const courseUpdateSchema = courseCreateSchema.partial();

// GET all courses (with filtering options)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const title = searchParams.get("title");
    const published = searchParams.get("published");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build where conditions
    const where: any = {};
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (title) {
      where.title = {
        contains: title,
        mode: 'insensitive',
      };
    }

    if (published) {
      where.isPublished = published === "true";
    } else {
      // By default only show published courses
      where.isPublished = true;
    }

    // Count total courses for pagination
    const totalCourses = await db.course.count({ where });

    // Get courses with pagination, sorting and filtering
    const courses = await db.course.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sort as string]: order,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            purchases: true,
          },
        },
      },
    });

    return NextResponse.json({
      courses,
      meta: {
        total: totalCourses,
        page,
        limit,
        totalPages: Math.ceil(totalCourses / limit),
      },
    });
  } catch (error) {
    console.error("[COURSES_GET]", error);
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    );
  }
}

// POST a new course
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only teachers and admins can create courses
    if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validation = courseCreateSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    const { title, description, price, imageUrl, categoryId } = validation.data;

    // Create course in database
    const course = await db.course.create({
      data: {
        title,
        description,
        price,
        imageUrl,
        categoryId,
        userId: session.user.id,
      },
    });

    // Create first chapter automatically
    await db.chapter.create({
      data: {
        title: "Introduction",
        position: 1,
        courseId: course.id,
        isPublished: false,
        isFree: true,
      }
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("[COURSES_POST]", error);
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    );
  }
} 