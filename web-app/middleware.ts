import { auth0 } from "./lib/auth0";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const res = await auth0.middleware(request);
  const session = await auth0.getSession(request);
  const { pathname } = request.nextUrl;

  // 🚫 Allow these public routes without any session or role check
  const publicPaths = ["/login", "/unauthorized", "/api/auth", "/"];
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return res;
  }

  const user = session?.user;
  const roles: string[] = user?.["https://grafikapp.dev/claims/roles"] || [];
  const isLoggedIn = !!user;

  // 🔐 Block non-authenticated users from anything else
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔐 Role-based route protection
  const roleProtectedRoutes: { pattern: RegExp; allowedRoles: string[] }[] = [
    { pattern: /^\/admin/, allowedRoles: ["admin"] },
    { pattern: /^\/generator/, allowedRoles: ["planner", "admin"] },
    { pattern: /^\/workers/, allowedRoles: ["admin"] },
    { pattern: /^\/shifts/, allowedRoles: ["planner", "admin"] },
    { pattern: /^\/schedule-history/, allowedRoles: ["admin"] },
  ];

  for (const route of roleProtectedRoutes) {
    if (route.pattern.test(pathname)) {
      const isAllowed = roles.some((role) => route.allowedRoles.includes(role));
      if (!isAllowed) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
  }

  return res;
}

// ✅ Only match protected routes, not static files or excluded public paths
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/public|login|unauthorized|api/auth).*)",
  ],
};
