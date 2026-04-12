import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "snad-session-id";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (!request.cookies.get(COOKIE_NAME)) {
    const sessionId = crypto.randomUUID();
    response.cookies.set(COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  return response;
}

export const config = {
  matcher: ["/dialogue/:path*", "/api/dialogue/:path*"],
};
