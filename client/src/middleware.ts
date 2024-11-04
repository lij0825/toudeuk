import { NextRequest, NextResponse } from "next/server";

// Public routes that don't require authentication
const publicRoutes: string[] = [
  "/",
  "/auth/callback",
  "/manifest.json",
  "/sw.js",
  "/workbox-*.js",
  "/fallback-*.js",
];

// Static assets and API routes that should bypass middleware
const bypassRoutes: string[] = [
  "/_next",
  "/assets",
  "/images",
  "/icons",
  "/apis",
  "/favicon.ico",
];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => {
    if (route.includes("*")) {
      const regexPattern = route.replace("*", ".*");
      return new RegExp(`^${regexPattern}`).test(pathname);
    }
    return new RegExp(`^${route.replace(/\/$/, "")}(\/|$)`).test(pathname);
  });
}

function shouldBypassMiddleware(pathname: string): boolean {
  return bypassRoutes.some((route) => pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Log for debugging
  console.log("Middleware executing for path:", pathname);

  // Bypass middleware for static assets and API routes
  if (shouldBypassMiddleware(pathname)) {
    console.log("Bypassing middleware for:", pathname);
    return NextResponse.next();
  }

  // Skip middleware for PWA-specific files
  if (
    pathname.includes("sw.js") ||
    pathname.includes("workbox-") ||
    pathname.includes("manifest.json")
  ) {
    console.log("Bypassing middleware for PWA file:", pathname);
    return NextResponse.next();
  }

  // Check authentication for non-public routes
  if (!isPublicRoute(pathname)) {
    const isLoggedIn = request.cookies.get("refresh-token") !== undefined;
    console.log("Auth check for path:", pathname, "isLoggedIn:", isLoggedIn);

    if (!isLoggedIn) {
      console.log("Redirecting to home due to no auth");
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image).*)",
    // Include service worker and manifest
    "/sw.js",
    "/manifest.json",
    "/workbox-:path*",
  ],
};
