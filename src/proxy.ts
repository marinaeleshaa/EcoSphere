import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { applyAuthRules } from "@/backend/features/auth/middleware/auth.rules";
import { AuthSession } from "@/backend/features/auth/middleware/role.guards";

export const proxy = auth((req) => {
	const session = req.auth as AuthSession | null;
	const pathname = req.nextUrl.pathname;

	const result = applyAuthRules(req, session, pathname);
	if (result) return result;

	return NextResponse.next();
});

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
