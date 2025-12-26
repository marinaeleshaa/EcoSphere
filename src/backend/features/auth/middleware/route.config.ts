// export const PUBLIC_ROUTES = ["/", "/auth/"];

import { getCurrentUser } from "@/backend/utils/authHelper";
import { ApiResponse, unauthorized } from "@/types/api-helpers";
import { NextResponse } from "next/server";
import { getSession } from "next-auth/react";

// Protected: must be signed in
export const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/settings",
  "/admin",
  "/organizer",
  "/restaurant",
  "/recycleDash",
  "/recycle",
];

export type Role =
  | "admin"
  | "organizer"
  | "shop"
  | "recycleMan"
  | "restaurant"
  | "customer";

// Role-based rules (optional, but scalable)
export const ROLE_ROUTES: Record<string, string[]> = {
  "/admin": ["admin"],
  "/organizer": ["organizer", "shop", "restaurant"],
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

const checkRole = async (
  roles: string[],
  userRole: string
): Promise<NextResponse<ApiResponse<string>> | null> => {
  if (!roles.includes(userRole)) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  return null;
};

const createGuard = (roles: Role[]) => {
  return <T extends unknown[], R>(handler: ApiHandler<T, R>) => {
    return async (
      ...args: T
    ): Promise<NextResponse<ApiResponse<string>> | R> => {
      const user = await getCurrentUser();
      if (!user?.role) {
        return unauthorized();
      }
      const guard = await checkRole(roles, user?.role);
      if (guard) return guard;
      return handler(...args);
    };
  };
};

export const adminOnly = createGuard(["admin"]);
export const organizerOnly = createGuard(["organizer", "shop", "restaurant"]);
export const shopOnly = createGuard(["shop"]);
export const recycleManOnly = createGuard(["recycleMan"]);
export const userOnly = createGuard(["customer"]);
