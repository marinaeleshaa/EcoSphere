import { NextResponse, NextRequest } from "next/server";
import { ROLE_ROUTES } from "./route.config";
import { UserTypes } from "../dto/user.dto";

export interface AuthSession {
  user?: {
    role?: UserTypes;
  };
}

// ------------- Guard Function -------------
export const checkRoleAccess = (
  req: NextRequest,
  session: AuthSession | null,
  pathname: string
) => {
  const role = session?.user?.role;
  if (!role) return null;

  const matchedEntry = Object.entries(ROLE_ROUTES).find(([routePrefix]) =>
    pathname.startsWith(routePrefix)
  );
  if (!matchedEntry) return null;

  const [, allowedRoles] = matchedEntry;

  if (!allowedRoles.includes(role)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return null;
};
