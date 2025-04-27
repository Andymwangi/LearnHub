import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

// Get all items in the cart
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    // Get cart from cookies if not authenticated
    if (!userId) {
      const cartCookie = cookies().get("cart")?.value;
      const cartItems = cartCookie ? JSON.parse(cartCookie) : [];
      
      return NextResponse.json({ items: cartItems });
    }
    
    // Get cart from database
    // This uses a hypothetical cart table in the database
    // In a real app, you might want to store cart items in a separate table
    // For now, we'll fetch course info for items in the cart
    const cartCookie = cookies().get(`cart_${userId}`)?.value;
    const cartItemIds = cartCookie ? JSON.parse(cartCookie) : [];
    
    if (!cartItemIds.length) {
      return NextResponse.json({ items: [] });
    }
    
    // Fetch course details for the items in the cart
    const courses = await db.course.findMany({
      where: {
        id: {
          in: cartItemIds
        },
        isPublished: true
      },
      select: {
        id: true,
        title: true,
        price: true,
        imageUrl: true,
        user: {
          select: {
            name: true
          }
        }
      }
    });
    
    const items = courses.map((course: {
      id: string;
      title: string;
      price: number | null;
      imageUrl: string | null;
      user: { name: string } | null;
    }) => ({
      id: course.id,
      title: course.title,
      instructor: course.user?.name || "Unknown Instructor",
      imageUrl: course.imageUrl || "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
      price: course.price || 0
    }));
    
    return NextResponse.json({ items });
    
  } catch (error) {
    console.error("[CART_GET]", error);
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    );
  }
}

// Add an item to the cart
export async function POST(req: NextRequest) {
  try {
    const { courseId } = await req.json();
    
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }
    
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    // Course exists check
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true
      }
    });
    
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }
    
    // Already purchased check
    if (userId) {
      const alreadyPurchased = await db.purchase.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        }
      });
      
      if (alreadyPurchased) {
        return NextResponse.json(
          { error: "You already own this course" },
          { status: 400 }
        );
      }
    }
    
    // Handle cart storage based on auth status
    const cookieStore = cookies();
    
    if (userId) {
      // For authenticated users, store in user-specific cookie
      const cartCookie = cookieStore.get(`cart_${userId}`)?.value;
      const cart = cartCookie ? JSON.parse(cartCookie) : [];
      
      if (!cart.includes(courseId)) {
        cart.push(courseId);
        cookieStore.set(`cart_${userId}`, JSON.stringify(cart), {
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }
    } else {
      // For non-authenticated users, store in anonymous cart cookie
      const cartCookie = cookieStore.get("cart")?.value;
      const cart = cartCookie ? JSON.parse(cartCookie) : [];
      
      if (!cart.includes(courseId)) {
        cart.push(courseId);
        cookieStore.set("cart", JSON.stringify(cart), {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("[CART_POST]", error);
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    );
  }
} 