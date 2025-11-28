import { NextRequest, NextResponse } from "next/server";
import { PROTECTED_ROUTES } from "./route.config";
import { AuthSession, checkRoleAccess } from "./role.guards";

export const applyAuthRules = (
	req: NextRequest,
	session: AuthSession | null,
	pathname: string
) => {
	const signedIn = !!session;

	// 1. Signed-in users shouldn't access /auth/*
	if (signedIn && pathname === "/auth")
		return NextResponse.redirect(new URL("/dashboard", req.url));

	// 2. Not signed in → accessing protected route
	const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));

	if (!signedIn && isProtected) {
		const url = new URL("/auth", req.url);
		url.searchParams.set("callbackUrl", pathname);
		return NextResponse.redirect(url);
	}

	// 3. Role-based access
	return checkRoleAccess(req, session, pathname);
};
