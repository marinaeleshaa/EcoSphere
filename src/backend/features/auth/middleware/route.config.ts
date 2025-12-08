// export const PUBLIC_ROUTES = ["/", "/auth/"];

// Protected: must be signed in
export const PROTECTED_ROUTES = [
	"/dashboard",
	"/profile",
	"/settings",
	// "/store",
];

// Role-based rules (optional, but scalable)
export const ROLE_ROUTES: Record<string, string[]> = {
	"/admin": ["admin"],
	"/vendor": ["vendor", "admin"],
};
