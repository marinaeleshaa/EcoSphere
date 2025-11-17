import { rootContainer } from "@/backend/config/container";
import UserController from "@/backend/features/user/user.controller";
import { NextRequest, NextResponse } from "next/server";
import { handleApiRequest } from "@/types/api-helpers";
import type { UsersResponse } from "@/types/api.types";

export const GET = async (
  _req: NextRequest
): Promise<NextResponse<UsersResponse>> => {
  return handleApiRequest(async () => {
    const controller = rootContainer.resolve(UserController);
    const result = await controller.getAll();
    return result;
  });
};
