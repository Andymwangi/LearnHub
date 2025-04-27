import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { 
  sendWelcomeEmail, 
  sendCourseEnrollmentEmail, 
  sendPasswordResetEmail,
  sendCertificateEmail
} from "@/lib/email";

// Email request schema
const emailSchema = z.object({
  type: z.enum(['welcome', 'course-enrollment', 'password-reset', 'certificate']),
  data: z.object({
    name: z.string().optional(),
    email: z.string().email(),
    courseName: z.string().optional(),
    courseId: z.string().optional(),
    certificateId: z.string().optional(),
    resetToken: z.string().optional(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    // Only admins and the system should be able to send emails
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SYSTEM")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = emailSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    const { type, data } = validation.data;
    let result;

    switch (type) {
      case 'welcome':
        if (!data.name) {
          return NextResponse.json(
            { error: "Name is required for welcome emails" },
            { status: 400 }
          );
        }
        result = await sendWelcomeEmail(data.name, data.email);
        break;
        
      case 'course-enrollment':
        if (!data.name || !data.courseName || !data.courseId) {
          return NextResponse.json(
            { error: "Name, courseName, and courseId are required for enrollment emails" },
            { status: 400 }
          );
        }
        result = await sendCourseEnrollmentEmail(
          data.name, 
          data.email, 
          data.courseName, 
          data.courseId
        );
        break;
        
      case 'password-reset':
        if (!data.name || !data.resetToken) {
          return NextResponse.json(
            { error: "Name and resetToken are required for password reset emails" },
            { status: 400 }
          );
        }
        result = await sendPasswordResetEmail(
          data.name, 
          data.email, 
          data.resetToken
        );
        break;
        
      case 'certificate':
        if (!data.name || !data.courseName || !data.certificateId) {
          return NextResponse.json(
            { error: "Name, courseName, and certificateId are required for certificate emails" },
            { status: 400 }
          );
        }
        result = await sendCertificateEmail(
          data.name, 
          data.email, 
          data.courseName, 
          data.certificateId
        );
        break;
        
      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (error) {
    console.error("[EMAIL_SEND_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    );
  }
} 