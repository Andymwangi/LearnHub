"use server";

import { auth } from "../../auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { formatPrice } from "@/lib/payment-utils";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Admin authentication middleware
async function adminAuth() {
  try {
    // Use getServerSession directly instead of the auth() helper for server actions
    const session = await getServerSession(authOptions);
    
    // Log session info for debugging
    console.log("Admin auth session:", session?.user);
    
    // Instead of redirecting, we'll return an object with auth status
    if (!session) {
      console.log("No session found");
      return { 
        authenticated: false, 
        authorized: false, 
        error: "No session found" 
      };
    }
    
    if (!session.user) {
      console.log("No user in session");
      return { 
        authenticated: true, 
        authorized: false, 
        error: "No user found in session" 
      };
    }
    
    if (session.user.role !== "ADMIN") {
      console.log(`User role is ${session.user.role}, not ADMIN`);
      return { 
        authenticated: true, 
        authorized: false, 
        error: "User is not an admin" 
      };
    }
    
    // User is authenticated and authorized
    return { 
      authenticated: true, 
      authorized: true, 
      session 
    };
  } catch (error) {
    console.error("Error in adminAuth:", error);
    return { 
      authenticated: false, 
      authorized: false, 
      error: "Authentication error" 
    };
  }
}

// Fetch all dashboard data for admin panel
export async function getDashboardData() {
  try {
    const authResult = await adminAuth();
    
    // Check authorization
    if (!authResult.authenticated || !authResult.authorized) {
      console.log("Not authorized:", authResult.error);
      return { error: "Not authorized to access admin data" };
    }
    
    // TypeScript assertion - we know session exists if authorized is true
    const session = authResult.session!;
    
    // If we get here, we're authenticated as admin
    console.log("Fetching dashboard data for admin:", session.user.email);
    
    // Get counts of all entities
    const [
      totalUsers,
      totalCourses,
      totalCategories,
      totalPurchases,
      publishedCourses
    ] = await Promise.all([
      db.user.count(),
      db.course.count(),
      db.category.count(),
      db.purchase.count(),
      db.course.count({
        where: {
          isPublished: true
        }
      })
    ]);

    // Get recent users (last 5)
    const recentUsers = await db.user.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true
      }
    });

    // Get popular categories (with most courses)
    const popularCategories = await db.category.findMany({
      take: 5,
      orderBy: {
        courses: {
          _count: "desc"
        }
      },
      include: {
        _count: {
          select: {
            courses: true
          }
        }
      }
    });

    // Get recent purchases
    const recentPurchases = await db.purchase.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        course: {
          select: {
            title: true,
            price: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    // Get user role distribution
    const usersRoleData = await db.user.groupBy({
      by: ["role"],
      _count: {
        role: true
      }
    });

    // Convert role data to a usable format
    const roleDataMap = usersRoleData.reduce((acc: Record<string, number>, item: { role: string; _count: { role: number } }) => {
      acc[item.role] = item._count.role;
      return acc;
    }, {} as Record<string, number>);

    // Get user signups by date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userSignupsByDate = await db.user.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      _count: true
    });

    // Format user signups into a usable structure
    const formattedUserSignups = userSignupsByDate.map((item: { createdAt: Date; _count: number }) => ({
      date: item.createdAt.toISOString().split('T')[0],
      count: item._count
    }));

    // Get purchases by date (last 30 days)
    const purchasesByDate = await db.purchase.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      _count: true
    });

    // Format purchases into a usable structure
    const formattedPurchases = purchasesByDate.map((item: { createdAt: Date; _count: number }) => ({
      date: item.createdAt.toISOString().split('T')[0],
      count: item._count
    }));

    // Calculate revenue by summing prices from purchased courses
    const purchasesWithPrices = await db.purchase.findMany({
      include: {
        course: {
          select: {
            price: true
          }
        }
      }
    });
    
    const totalRevenue = purchasesWithPrices.reduce((sum: number, purchase: { course: { price: number | null } }) => {
      return sum + (purchase.course.price || 0);
    }, 0);
    
    const formattedRevenue = formatPrice(totalRevenue);

    return {
      totalUsers,
      totalCourses,
      totalCategories,
      totalRevenue,
      formattedRevenue,
      totalPurchases,
      publishedCourses,
      recentUsers,
      popularCategories,
      recentPurchases,
      usersRoleData: roleDataMap,
      userSignupsByDate: formattedUserSignups,
      purchasesByDate: formattedPurchases
    };
  } catch (error) {
    console.error("Error in getDashboardData:", error);
    return { error: "Failed to fetch dashboard data" };
  }
}

export async function getUsers(query = "", role?: string, page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;
    
    // Build the where condition
    const where: any = {};
    
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } }
      ];
    }
    
    if (role && ['ADMIN', 'TEACHER', 'STUDENT'].includes(role)) {
      where.role = role;
    }
    
    // Get users with pagination
    const users = await db.user.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            purchases: true,
            courses: true
          }
        }
      }
    });
    
    // Get total count for pagination
    const totalUsers = await db.user.count({ where });
    
    return {
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function updateUserRole(userId: string, role: 'ADMIN' | 'TEACHER' | 'STUDENT') {
  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "Failed to update user role" };
  }
}

export async function getCategories(query = "", page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;
    
    // Build the where condition
    const where: any = {};
    
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ];
    }
    
    // Get categories with pagination
    const categories = await db.category.findMany({
      where,
      orderBy: {
        name: 'asc'
      },
      skip,
      take: limit,
      include: {
        _count: {
          select: {
            courses: true
          }
        }
      }
    });
    
    // Get total count for pagination
    const totalCategories = await db.category.count({ where });
    
    return {
      categories,
      totalCategories,
      totalPages: Math.ceil(totalCategories / limit),
      currentPage: page
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function createCategory(name: string, description?: string) {
  try {
    const existingCategory = await db.category.findUnique({
      where: { name }
    });
    
    if (existingCategory) {
      return { success: false, error: "Category with this name already exists" };
    }
    
    const newCategory = await db.category.create({
      data: {
        name,
        description
      }
    });
    
    return { success: true, category: newCategory };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(id: string, name: string, description?: string) {
  try {
    // Check if another category with the same name exists
    const existingCategory = await db.category.findFirst({
      where: {
        name,
        id: { not: id }
      }
    });
    
    if (existingCategory) {
      return { success: false, error: "Another category with this name already exists" };
    }
    
    const updatedCategory = await db.category.update({
      where: { id },
      data: {
        name,
        description
      }
    });
    
    return { success: true, category: updatedCategory };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    // Check if the category has associated courses
    const categoryWithCourses = await db.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { courses: true }
        }
      }
    });
    
    if (categoryWithCourses && categoryWithCourses._count.courses > 0) {
      return { 
        success: false, 
        error: `Cannot delete category that has ${categoryWithCourses._count.courses} associated courses` 
      };
    }
    
    await db.category.delete({
      where: { id }
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
} 