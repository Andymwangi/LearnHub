import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";

// Remove an item from the cart
export async function DELETE(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params;
    
    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }
    
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const cookieStore = cookies();
    
    if (userId) {
      // For authenticated users
      const cartCookie = cookieStore.get(`cart_${userId}`)?.value;
      
      if (cartCookie) {
        const cart = JSON.parse(cartCookie);
        const updatedCart = cart.filter((id: string) => id !== itemId);
        
        cookieStore.set(`cart_${userId}`, JSON.stringify(updatedCart), {
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }
    } else {
      // For non-authenticated users
      const cartCookie = cookieStore.get("cart")?.value;
      
      if (cartCookie) {
        const cart = JSON.parse(cartCookie);
        const updatedCart = cart.filter((id: string) => id !== itemId);
        
        cookieStore.set("cart", JSON.stringify(updatedCart), {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("[CART_ITEM_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    );
  }
} 