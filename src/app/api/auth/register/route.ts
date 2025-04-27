import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["STUDENT", "TEACHER", "ADMIN"]).default("STUDENT"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: validation.error.errors },
        { status: 400 }
      );
    }
    
    const { name, email, role } = validation.data;
    
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      // If user exists, inform the client but don't treat as an error
      // This way the flow can continue to the sign-in step
      return NextResponse.json(
        { 
          message: "User already exists",
          exists: true,
          // Include the user's role to help with redirection
          role: existingUser.role 
        },
        { status: 200 }
      );
    }
    
    // Create the user
    await db.user.create({
      data: {
        name,
        email,
        role,
      },
    });
    
    return NextResponse.json(
      { message: "Registration successful", exists: false },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 