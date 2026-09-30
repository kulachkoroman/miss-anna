import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    if (!session || session.role !== "ADMIN") {
      const url = new URL("/admin/login", request.url);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/cabinet")) {
    if (!session) {
      const url = new URL("/", request.url);
      url.searchParams.set("auth", "1");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cabinet/:path*", "/admin/:path*"],
};
