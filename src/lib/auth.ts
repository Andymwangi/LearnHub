import { NextAuthOptions } from "next-auth";
import { db } from "@/lib/db";
import { sendMagicLinkEmail } from "@/lib/email";
import EmailProvider from "next-auth/providers/email";
import { randomBytes } from "crypto";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";

// Function to determine if an email should be an admin
function isAdminEmail(email: string): boolean {
  const adminEmails = [
    "andymwangi3@gmail.com",
    "itsndege@gmail.com",
    "admin@example.com",
    "administrator@example.com",
  ];
  
  return adminEmails.includes(email.toLowerCase());
}

// Function to determine if an email should be a teacher
function isTeacherEmail(email: string): boolean {
  const teacherEmails = [
    "teacher@example.com",
    "instructor@example.com",
  ];
  
  return teacherEmails.includes(email.toLowerCase());
}

// Create a custom adapter that extends the PrismaAdapter
const customPrismaAdapter = () => {
  const prismaAdapter = PrismaAdapter(db) as unknown as Adapter;
  
  return {
    ...prismaAdapter,
    // Override the useVerificationToken method to safely handle token deletion
    useVerificationToken: async (params: { identifier: string; token: string }) => {
      try {
        console.log(`[DEBUG] Using verification token for ${params.identifier}`);
        
        // Try to get the token
        const verificationToken = await db.verificationToken.findUnique({
          where: { 
            token: params.token,
          },
        });

        if (!verificationToken) {
          console.log(`[DEBUG] No verification token found for token: ${params.token.substring(0, 10)}...`);
          return null;
        }

        console.log(`[DEBUG] Found token. Checking expiration: ${verificationToken.expires}`);
        
        // Check if token is expired
        if (verificationToken.expires < new Date()) {
          console.log(`[DEBUG] Token expired at ${verificationToken.expires}`);
          try {
            await db.verificationToken.delete({
              where: { token: params.token },
            });
          } catch (error) {
            console.log(`[DEBUG] Failed to delete expired token: ${error}`);
          }
          return null;
        }

        // Check if the identifier matches
        if (verificationToken.identifier !== params.identifier) {
          console.log(`[DEBUG] Email mismatch. Token email: ${verificationToken.identifier}, Request email: ${params.identifier}`);
          return null;
        }

        console.log(`[DEBUG] Token valid. Proceeding with authentication.`);

        // Try to delete the token if it exists
        try {
          await db.verificationToken.delete({
            where: {
              token: params.token,
            },
          });
          console.log(`[DEBUG] Token deleted successfully`);
        } catch (error) {
          console.log("[DEBUG] Token deletion failed, but continuing authentication process:", error);
        }

        return verificationToken;
      } catch (error) {
        console.error("[DEBUG] Error in useVerificationToken:", error);
        return null;
      }
    }
  };
};

export const authOptions: NextAuthOptions = {
  adapter: customPrismaAdapter() as unknown as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/sign-in",
    error: "/auth-error",
    verifyRequest: "/verify-request",
  },
  providers: [
    EmailProvider({
      server: {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      },
      from: process.env.GMAIL_USER || "noreply@example.com",
      maxAge: 24 * 60 * 60, // 24 hours (increased from 10 minutes)
      generateVerificationToken() {
        return randomBytes(32).toString("hex");
      },
      sendVerificationRequest: async ({ identifier, url }) => {
        const user = await db.user.findUnique({
          where: { email: identifier },
          select: { name: true },
        });

        const userName = user?.name || "there";
        await sendMagicLinkEmail(userName, identifier, url);
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email }) {
      // For email provider sign-ins
      if (email?.verificationRequest) {
        // This is just the email request, not the actual verification
        return true;
      }
      
      if (user.email) {
        const existingUser = await db.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          // If user exists, check if role needs to be updated
          let roleToUpdate = null;
          
          if (isAdminEmail(user.email) && existingUser.role !== "ADMIN") {
            roleToUpdate = "ADMIN";
          } else if (isTeacherEmail(user.email) && existingUser.role !== "TEACHER") {
            roleToUpdate = "TEACHER";
          }
          
          if (roleToUpdate) {
            await db.user.update({
              where: { email: user.email },
              data: { role: roleToUpdate as "ADMIN" | "TEACHER" | "STUDENT" },
            });
          }
          
          // Update emailVerified if not set
          if (!existingUser.emailVerified) {
            await db.user.update({
              where: { email: user.email },
              data: { emailVerified: new Date() },
            });
          }
        } else {
          // Create new user with appropriate role
          let role: "ADMIN" | "TEACHER" | "STUDENT" = "STUDENT";
          if (isAdminEmail(user.email)) {
            role = "ADMIN";
          } else if (isTeacherEmail(user.email)) {
            role = "TEACHER";
          }
          
          await db.user.create({
            data: {
              email: user.email,
              name: user.name || user.email.split("@")[0],
              role: role,
              emailVerified: new Date(),
            },
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as "ADMIN" | "TEACHER" | "STUDENT";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      // Fetch the latest role if the user already has a token
      else if (token?.sub) {
        const userData = await db.user.findUnique({
          where: { id: token.sub },
          select: { role: true }
        });
        
        if (userData) {
          // Always use the current role from the database
          token.role = userData.role;
        }
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // If the URL is relative, prepend the base URL
      if (url.startsWith('/')) {
        // Handle special cases for dashboard redirects
        if (url === '/dashboard') {
          // This will be properly handled by middleware based on user's role
          return `${baseUrl}/dashboard`;
        }
        
        // All other relative URLs
        return `${baseUrl}${url}`;
      } 
      // If the URL is already absolute and on the same site, return it
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Default to the base URL for any other case
      return baseUrl;
    }
  },
  events: {
    async signIn({ user }) {
      // Update last login time when user signs in
      if (user.id) {
        try {
          await db.user.update({
            where: { id: user.id },
            data: { 
              // Only update fields that exist in the schema
              updatedAt: new Date()
            },
          });
        } catch (error) {
          console.error("Failed to update user login time:", error);
        }
      }
    },
  },
}; 