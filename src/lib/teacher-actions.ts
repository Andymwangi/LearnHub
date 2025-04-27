"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Teacher authentication middleware - returns the session directly or null
async function getTeacherSession() {
  try {
    const session = await getServerSession(authOptions);
    
    // Log session info for debugging
    console.log("Teacher auth session:", session?.user);
    
    if (!session || !session.user) {
      console.log("No valid session found");
      return null;
    }
    
    // Teachers and admins can access teacher functions
    if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
      console.log(`User role is ${session.user.role}, not TEACHER or ADMIN`);
      return null;
    }
    
    // Return the valid session
    return session;
  } catch (error) {
    console.error("Error in teacherAuth:", error);
    return null;
  }
}

// Create a new course
export async function createCourse(title: string, userId: string) {
  const session = await getTeacherSession();
  
  if (!session) {
    return { 
      success: false, 
      error: "Unauthorized - You must be a teacher or admin to perform this action" 
    };
  }
  
  try {
    const course = await db.course.create({
      data: {
        userId: userId,
        title: title,
      },
    });
    
    revalidatePath("/dashboard/teacher");
    return { success: true, courseId: course.id };
  } catch (error) {
    console.error("Error creating course:", error);
    return { success: false, error: "Failed to create course" };
  }
}

// Update course by ID
export async function updateCourse(
  courseId: string, 
  data: {
    title?: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    categoryId?: string;
    isPublished?: boolean;
  }
) {
  const session = await getTeacherSession();
  
  if (!session) {
    return { 
      success: false, 
      error: "Unauthorized - You must be a teacher or admin to perform this action" 
    };
  }
  
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });
    
    if (!course) {
      return { success: false, error: "Course not found" };
    }
    
    // Check if user owns the course
    if (course.userId !== session.user.id && session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }
    
    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data
    });
    
    revalidatePath(`/dashboard/teacher/courses/${courseId}`);
    revalidatePath("/dashboard/teacher");
    return { success: true, course: updatedCourse };
  } catch (error) {
    console.error("Error updating course:", error);
    return { success: false, error: "Failed to update course" };
  }
}

// Get courses by teacher ID
export async function getTeacherCourses() {
  const session = await getTeacherSession();
  
  if (!session) {
    return { 
      success: false, 
      error: "Unauthorized - You must be a teacher or admin to perform this action" 
    };
  }
  
  try {
    const courses = await db.course.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        chapters: {
          select: {
            id: true,
            title: true,
            isPublished: true,
          },
          orderBy: {
            position: "asc"
          }
        },
        purchases: {
          select: {
            id: true,
          }
        },
        _count: {
          select: {
            purchases: true
          }
        }
      }
    });
    
    return { success: true, courses };
  } catch (error) {
    console.error("Error fetching teacher courses:", error);
    return { success: false, error: "Failed to fetch courses" };
  }
}

// Get course by ID
export async function getCourseById(courseId: string) {
  const session = await getTeacherSession();
  
  if (!session) {
    return { 
      success: false, 
      error: "Unauthorized - You must be a teacher or admin to perform this action" 
    };
  }
  
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        category: true,
        chapters: {
          orderBy: {
            position: "asc"
          }
        }
      }
    });
    
    if (!course) {
      return { success: false, error: "Course not found" };
    }
    
    // Check if user owns the course
    if (course.userId !== session.user.id && session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }
    
    return { success: true, course };
  } catch (error) {
    console.error("Error fetching course:", error);
    return { success: false, error: "Failed to fetch course" };
  }
}

// Create chapter for a course
export async function createChapter(courseId: string, title: string) {
  const session = await getTeacherSession();
  
  if (!session) {
    return { 
      success: false, 
      error: "Unauthorized - You must be a teacher or admin to perform this action" 
    };
  }
  
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          orderBy: {
            position: "asc"
          }
        }
      }
    });
    
    if (!course) {
      return { success: false, error: "Course not found" };
    }
    
    // Check if user owns the course
    if (course.userId !== session.user.id && session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }
    
    // Get the last position
    const lastPosition = course.chapters.length > 0 
      ? course.chapters[course.chapters.length - 1].position 
      : 0;
    
    const chapter = await db.chapter.create({
      data: {
        title,
        courseId,
        position: lastPosition + 1
      }
    });
    
    revalidatePath(`/dashboard/teacher/courses/${courseId}`);
    return { success: true, chapterId: chapter.id };
  } catch (error) {
    console.error("Error creating chapter:", error);
    return { success: false, error: "Failed to create chapter" };
  }
}

// Update chapter
export async function updateChapter(
  chapterId: string,
  data: {
    title?: string;
    description?: string;
    videoUrl?: string;
    isFree?: boolean;
    isPublished?: boolean;
  }
) {
  const session = await getTeacherSession();
  
  if (!session) {
    return { 
      success: false, 
      error: "Unauthorized - You must be a teacher or admin to perform this action" 
    };
  }
  
  try {
    const chapter = await db.chapter.findUnique({
      where: { id: chapterId },
      include: {
        course: true
      }
    });
    
    if (!chapter) {
      return { success: false, error: "Chapter not found" };
    }
    
    // Check if user owns the course
    if (chapter.course.userId !== session.user.id && session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }
    
    const updatedChapter = await db.chapter.update({
      where: { id: chapterId },
      data
    });
    
    // If publishing a chapter, also check if we need to publish the course
    if (data.isPublished) {
      const unpublishedChaptersCount = await db.chapter.count({
        where: {
          courseId: chapter.courseId,
          isPublished: false
        }
      });
      
      if (unpublishedChaptersCount === 0) {
        await db.course.update({
          where: { id: chapter.courseId },
          data: { isPublished: true }
        });
      }
    }
    
    revalidatePath(`/dashboard/teacher/courses/${chapter.courseId}/chapters/${chapterId}`);
    revalidatePath(`/dashboard/teacher/courses/${chapter.courseId}`);
    return { success: true, chapter: updatedChapter };
  } catch (error) {
    console.error("Error updating chapter:", error);
    return { success: false, error: "Failed to update chapter" };
  }
}

// Delete chapter
export async function deleteChapter(chapterId: string) {
  const session = await getTeacherSession();
  
  if (!session) {
    return { 
      success: false, 
      error: "Unauthorized - You must be a teacher or admin to perform this action" 
    };
  }
  
  try {
    const chapter = await db.chapter.findUnique({
      where: { id: chapterId },
      include: {
        course: true
      }
    });
    
    if (!chapter) {
      return { success: false, error: "Chapter not found" };
    }
    
    // Check if user owns the course
    if (chapter.course.userId !== session.user.id && session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }
    
    await db.chapter.delete({
      where: { id: chapterId }
    });
    
    // Reorder remaining chapters
    const remainingChapters = await db.chapter.findMany({
      where: {
        courseId: chapter.courseId,
        position: {
          gt: chapter.position
        }
      },
      orderBy: {
        position: "asc"
      }
    });
    
    // Update positions
    for (const [index, chapter] of remainingChapters.entries()) {
      await db.chapter.update({
        where: { id: chapter.id },
        data: { position: chapter.position - 1 }
      });
    }
    
    revalidatePath(`/dashboard/teacher/courses/${chapter.courseId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return { success: false, error: "Failed to delete chapter" };
  }
}

// Update chapter positions (for drag and drop reordering)
export async function reorderChapters(courseId: string, orderedIds: string[]) {
  const session = await getTeacherSession();
  
  if (!session) {
    return { 
      success: false, 
      error: "Unauthorized - You must be a teacher or admin to perform this action" 
    };
  }
  
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });
    
    if (!course) {
      return { success: false, error: "Course not found" };
    }
    
    // Check if user owns the course
    if (course.userId !== session.user.id && session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }
    
    // Update positions
    for (const [index, id] of orderedIds.entries()) {
      await db.chapter.update({
        where: { id },
        data: { position: index + 1 }
      });
    }
    
    revalidatePath(`/dashboard/teacher/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error("Error reordering chapters:", error);
    return { success: false, error: "Failed to reorder chapters" };
  }
}

// Delete course
export async function deleteCourse(courseId: string) {
  const session = await getTeacherSession();
  
  if (!session) {
    return { 
      success: false, 
      error: "Unauthorized - You must be a teacher or admin to perform this action" 
    };
  }
  
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });
    
    if (!course) {
      return { success: false, error: "Course not found" };
    }
    
    // Check if user owns the course
    if (course.userId !== session.user.id && session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }
    
    await db.course.delete({
      where: { id: courseId }
    });
    
    revalidatePath("/dashboard/teacher");
    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { success: false, error: "Failed to delete course" };
  }
}

// Get teacher stats
export async function getTeacherStats() {
  const session = await getTeacherSession();
  
  if (!session) {
    return { 
      success: false, 
      error: "Unauthorized - You must be a teacher or admin to perform this action" 
    };
  }
  
  try {
    // Get total courses
    const totalCourses = await db.course.count({
      where: { userId: session.user.id }
    });
    
    // Get total students (unique users who purchased courses)
    const purchases = await db.purchase.findMany({
      where: {
        course: {
          userId: session.user.id
        }
      },
      select: {
        userId: true
      }
    });
    
    // Use Set to count unique students
    const uniqueStudentIds = new Set(purchases.map((purchase: { userId: string }) => purchase.userId));
    const totalStudents = uniqueStudentIds.size;
    
    // Calculate total revenue from course purchases
    const courses = await db.course.findMany({
      where: { userId: session.user.id },
      include: {
        purchases: true
      }
    });
    
    const totalRevenue = courses.reduce((acc: number, course: { purchases: any[]; price: number | null }) => {
      const courseRevenue = course.purchases.length * (course.price || 0);
      return acc + courseRevenue;
    }, 0);
    
    return { 
      success: true, 
      totalCourses,
      totalStudents,
      totalRevenue
    };
  } catch (error) {
    console.error("Error fetching teacher stats:", error);
    return { success: false, error: "Failed to fetch stats" };
  }
} 