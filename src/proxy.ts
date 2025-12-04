import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { applyAuthRules } from "@/backend/features/auth/middleware/auth.rules";
import { AuthSession } from "@/backend/features/auth/middleware/role.guards";
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export const proxy = auth((req) => {
	const session = req.auth as AuthSession | null;
	const pathname = req.nextUrl.pathname;

	const result = applyAuthRules(req, session, pathname);
	if (result) return result;

	// Handle locale detection for routes without [locale] folder
	const response = intlMiddleware(req);
	
	return response;
});

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
