import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const pathname = req.nextUrl.pathname;
    
    // Check for various page types
    const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
    const isDashboardPage = pathname.startsWith("/dashboard");
    const isAdminPage = pathname.startsWith("/dashboard/admin");
    const isTeacherPage = pathname.startsWith("/dashboard/teacher");
    const isStudentPage = pathname.startsWith("/dashboard/student");
    
    // Handle redirect loops - if we detect a loop, go to home page
    const searchParams = req.nextUrl.searchParams;
    const callbackUrl = searchParams.get("callbackUrl");
    
    // Improved redirect loop detection
    if (callbackUrl) {
      // Check for deeply nested callback URLs or multiple sign-in redirects
      if (callbackUrl.includes("/sign-in?callbackUrl=") || 
          callbackUrl.includes(encodeURIComponent("/sign-in?callbackUrl=")) ||
          new URL(req.url).pathname === "/sign-in" && new URL(callbackUrl, req.url).pathname === "/sign-in") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // If user is not authenticated and trying to access protected routes
    if (!isAuth && isDashboardPage) {
      const signInUrl = new URL("/sign-in", req.url);
      // Store original path for redirecting back after login
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // If user is authenticated and trying to access auth pages
    if (isAuth && isAuthPage) {
      // Check if there's a callback URL to redirect to after auth
      const callbackUrl = searchParams.get("callbackUrl");
      
      if (callbackUrl && !callbackUrl.includes("/sign-")) {
        // If there's a valid callback URL, redirect there
        return NextResponse.redirect(new URL(callbackUrl, req.url));
      }
      
      // Otherwise redirect based on role
      if (token.role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      } else if (token.role === "TEACHER") {
        return NextResponse.redirect(new URL("/dashboard/teacher", req.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Handle dashboard root redirect based on role
    if (isAuth && pathname === "/dashboard") {
      // Redirect to role-specific dashboard
      if (token.role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      } else if (token.role === "TEACHER") {
        return NextResponse.redirect(new URL("/dashboard/teacher", req.url));
      }
    }

    // Role-based access control
    if (isAuth) {
      // Restrict admin pages to admin users
      if (isAdminPage && token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      
      // Restrict teacher pages to teacher users and admins (admins can access teacher pages)
      if (isTeacherPage && token.role !== "TEACHER" && token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      
      // Restrict student pages to student users
      if (isStudentPage && token.role !== "STUDENT") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Only require authentication for dashboard routes
        if (pathname.startsWith('/dashboard')) {
          return !!token;
        }
        // Allow access to all other routes without authentication
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    // Protected routes that require authentication
    '/dashboard/:path*',
    // Auth pages
    '/sign-in',
    '/sign-up',
  ],
}; 