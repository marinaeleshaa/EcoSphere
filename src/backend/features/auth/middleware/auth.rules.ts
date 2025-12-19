import { NextRequest, NextResponse } from "next/server";
import { PROTECTED_ROUTES } from "./route.config";
import { AuthSession, checkRoleAccess } from "./role.guards";

export const applyAuthRules = (
  req: NextRequest,
  session: AuthSession | null,
  pathname: string
) => {
  const signedIn = !!session;

  // Strip locale prefix (e.g., /en/admin -> /admin)
  const locales = ["en", "ar", "fr"];
  let normalizedPath = pathname;
  for (const loc of locales) {
    if (pathname.startsWith(`/${loc}/`)) {
      normalizedPath = pathname.replace(`/${loc}`, "");
      break;
    } else if (pathname === `/${loc}`) {
      normalizedPath = "/";
      break;
    }
  }

  // 1. Signed-in users shouldn't access /auth/*
  if (
    signedIn &&
    (normalizedPath === "/auth" || normalizedPath.startsWith("/auth/"))
  )
    return NextResponse.redirect(new URL("/", req.url));

  // 2. Not signed in → accessing protected route
  const isProtected = PROTECTED_ROUTES.some((r) =>
    normalizedPath.startsWith(r)
  );

  if (!signedIn && isProtected) {
    const url = new URL("/auth", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // 3. Role-based access
  return checkRoleAccess(req, session, normalizedPath);
};
