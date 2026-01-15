import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

// Routes that don't require any session checks (allow all)
const publicRoutes = ["/", "/privacy", "/terms"];
// Routes that should redirect to /page-1 if user is already logged in
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Public routes: do nothing regardless of session status
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    const session = await auth.api.getSession({
        headers: await headers()
    });

    // Auth routes (login/signup): redirect to /page-1 if session exists
    if (authRoutes.includes(pathname)) {
        if (session) {
            return NextResponse.redirect(new URL("/page-1", request.url));
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
        "/",
        "/privacy",
        "/terms",
        "/login",
        "/signup",
        "/page-1",
    ], // NOTE: add more routes if needed
};