import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedPaths = ["/dashboard", "/settings"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (isProtected) {
    const token = request.cookies.get("authjs.session-token")?.value;
    if (!token) return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/settings/:path*"] };
