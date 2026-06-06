import { auth } from "@/lib/auth-edge";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/api/auth", "/api/generate", "/progress"];

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (!isPublic && !req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
