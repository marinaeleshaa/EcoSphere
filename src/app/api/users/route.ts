import { rootContainer } from "@/backend/config/container";
import UserController from "@/backend/features/user/user.controller";
import { IUser } from "@/backend/features/user/user.model";
import { ApiResponse, ok } from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest
): Promise<NextResponse<ApiResponse<IUser[]>>> => {
  return ok(await rootContainer.resolve(UserController).getAll());
};
