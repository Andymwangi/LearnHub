import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    // In a real implementation, you would upload this file to a cloud storage service
    // like AWS S3, Cloudinary, or similar, and get back a URL to the uploaded file
    
    // Simulating a successful upload with a placeholder URL
    // In production, replace this with actual file upload logic
    const imageUrl = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`;

    const updatedUser = await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        avatarUrl: imageUrl,
        // Also update the NextAuth image field for consistency
        image: imageUrl,
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        image: true,
      },
    });

    return NextResponse.json({
      message: "Profile image updated successfully",
      user: updatedUser
    }, { status: 200 });
  } catch (error) {
    console.error("[PROFILE_IMAGE_UPLOAD]", error);
    return NextResponse.json(
      { message: "Error uploading profile image" },
      { status: 500 }
    );
  }
} 