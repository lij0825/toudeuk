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
  "/fonts",
  "/default_profile.jpg",
];

// Protected routes that require authentication
const protectedRoutes: string[] = [
  "/mypage",
  "/settings",
  "/gifticon",
  "/history",
  "/mygifticon",
  "/point",
  "/rank",
  "/kapay",
  "/mypage",
  "/toudeuk",
  // Add other protected routes here
];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => {
    if (route.includes("*")) {
      const regexPattern = route.replace("*", ".*");
      return new RegExp(`^${regexPattern}`).test(pathname);
    }
    return pathname === route || pathname === `${route}/`;
  });
}

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
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

  // Check authentication specifically for protected routes
  if (isProtectedRoute(pathname)) {
    const isLoggedIn = request.cookies.get("refresh-token") !== undefined;
    console.log(
      "Auth check for protected path:",
      pathname,
      "isLoggedIn:",
      isLoggedIn
    );

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
    "/((?!_next/static|_next/image|favicon.ico).*)",
    // Include service worker and manifest
    "/sw.js",
    "/manifest.json",
    "/workbox-:path*",
  ],
};
