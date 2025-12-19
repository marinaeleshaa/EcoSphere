// export const PUBLIC_ROUTES = ["/", "/auth/"];

import { getCurrentUser } from "@/backend/utils/authHelper";
import { ApiResponse, unauthorized } from "@/types/api-helpers";
import { NextResponse } from "next/server";

// Protected: must be signed in
export const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/settings",
  "/admin",
  "/organizer",
  "/restaurant",
  "/recycleDash",
];

// Role-based rules (optional, but scalable)
export const ROLE_ROUTES: Record<string, string[]> = {
  "/admin": ["admin"],
  "/organizer": ["organizer"],
  "/restaurant": ["shop", "restaurant"],
  "/recycleDash": ["recycleMan"],
  "/shop": ["customer"],
  "/store": ["customer"],
  "/game": ["customer"],
  "/cart": ["customer"],
  "/fav": ["customer"],
  "/checkout": ["customer"],
  "/recipes": ["customer"],
};

type ApiHandler<T extends unknown[], R> = (...args: T) => Promise<R> | R;

async function checkRole(
  role:
    | "admin"
    | "organizer"
    | "shop"
    | "customer"
    | "recycleMan"
    | "restaurant"
): Promise<NextResponse<ApiResponse<string>> | null> {
  const user = await getCurrentUser();

  if (!user || user.role !== role) {
    return unauthorized(
      `Forbidden: ${role.charAt(0).toUpperCase() + role.slice(1)} access only`
    );
  }
  return null;
}

const createGuard = (
  role:
    | "admin"
    | "organizer"
    | "shop"
    | "customer"
    | "recycleMan"
    | "restaurant"
) => {
  return <T extends unknown[], R>(handler: ApiHandler<T, R>) => {
    return async (
      ...args: T
    ): Promise<NextResponse<ApiResponse<string>> | R> => {
      const guard = await checkRole(role);
      if (guard) return guard;
      return handler(...args);
    };
  };
};

export const adminOnly = createGuard("admin");
export const organizerOnly = createGuard("organizer");
export const shopOnly = createGuard("shop");
export const recycleManOnly = createGuard("recycleMan");
export const userOnly = createGuard("customer");
