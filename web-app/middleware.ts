import { auth0 } from "./lib/auth0";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const res = await auth0.middleware(request);
  const session = await auth0.getSession(request);
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ["/login", "/unauthorized", "/api/auth", "/"];
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return res;
  }

  const user = session?.user;
  const isLoggedIn = !!user;

  // Only check if user is logged in, not roles
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/public|login|unauthorized|api/auth).*)",
  ],
};