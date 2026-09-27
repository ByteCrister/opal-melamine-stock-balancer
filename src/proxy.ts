/**
 * @file src/middleware.ts
 *
 * Route protection middleware using NextAuth v5.
 *
 * - Unauthenticated users hitting any protected route → redirected to /signin
 * - Already-signed-in users hitting /signin → redirected to /
 * - Public routes (sign-in page, API auth routes) are explicitly excluded
 */

import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/signin"];

// Route prefixes that are always public (API auth handlers, assets)
const PUBLIC_PREFIXES = [
    "/api/auth",
    "/_next",
    "/favicon.ico",
];

export default auth(function proxy(req: NextRequest & { auth: unknown }) {
    const { pathname } = req.nextUrl;

    // Always allow public prefixes
    if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
        return NextResponse.next();
    }

    // Always allow exact public routes
    if (PUBLIC_ROUTES.includes(pathname)) {
        // Redirect signed-in users away from /signin back to home
        if (req.auth) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
    }

    // Protected route — require authentication
    if (!req.auth) {
        const signInUrl = new URL("/signin", req.url);
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
});

export const config = {
    // Run middleware on all routes except static files
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
