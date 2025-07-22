import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const authRes = await auth0.middleware(request);

    // authentication routes — let the middleware handle it
    if (request.nextUrl.pathname.startsWith("/auth")) {
        return authRes;
    }

    // public routes — no need to check for session
    if (request.nextUrl.pathname === "/") {
        return authRes;
    }

    const { origin } = request.nextUrl;
    const session = await auth0.getSession(request);

    // user does not have a session — redirect to login
    if (!session) {
        return NextResponse.redirect(`${origin}/auth/login`);
    }

    return authRes;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api).*)",
    ],
};