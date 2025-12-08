import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { applyAuthRules } from "@/backend/features/auth/middleware/auth.rules";
import { AuthSession } from "@/backend/features/auth/middleware/role.guards";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export const proxy = auth((req) => {
  const session = req.auth as AuthSession | null;
  const pathname = req.nextUrl.pathname;

  // Always apply auth rules (UI + API)
  const result = applyAuthRules(req, session, pathname);
  if (result) return result;

  // If this is an API/static request, skip next-intl and let the request proceed
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    /\.(svg|png|jpg|jpeg|gif|webp)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Otherwise (UI routes) run the locale middleware
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // include API in matcher so auth middleware runs for API too
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
