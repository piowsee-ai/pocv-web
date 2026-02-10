import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

// Routes that don't require any session checks (allow all)
const publicRoutes = ["/", "/privacy", "/terms"];
// Routes that should redirect to /create if user is already logged in
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes: do nothing regardless of session status
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Auth routes (login/signup): redirect to /create if session exists
  if (authRoutes.includes(pathname)) {
    if (session) {
      return NextResponse.redirect(new URL("/create", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes (everything else): redirect to /login if no session
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs", // Required for auth.api calls
  matcher: [
    /*
     * Match all paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - images, icons, assets (public folders)
     * - favicon, logo, apple-touch-icon (root public files)
     */
    "/((?!api|_next/static|_next/image|images|icons|assets|favicon|logo|apple-touch-icon).*)",
  ],
};
