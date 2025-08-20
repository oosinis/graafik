import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Auth0 disabled: simple pass-through middleware
  const res = NextResponse.next();
  const session: any = null;
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