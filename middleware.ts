import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();

  // If no session or user, redirect to login
  if (!session || !session.user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const userRole = session.user.role;
  const pathname = request.nextUrl.pathname;

  console.log("User role in middleware:", userRole);

  // ✅ Allow APPLICANT to access their routes
  if (
    pathname.startsWith("/dashboard/seeker/applications") ||
    pathname.startsWith("/dashboard/seeker/applyForJob") ||
    pathname.startsWith("/dashboard/seeker/registerApplicant") ||
     pathname.startsWith("/dashboard/seeker/profile")
  ) {
    if (userRole !== "APPLICANT") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next(); // ✅ Early return
  }

  // ✅ Only ADMIN can access other /dashboard routes
  if (pathname.startsWith("/dashboard") && userRole !== "CLERK") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
