import { auth } from "@/auth";
import { rootContainer } from "@/backend/config/container";
import UserController from "@/backend/features/user/user.controller";
import {
  ApiResponse,
  serverError,
  unauthorized,
  ok,
} from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ message: string }>>> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized("Not authenticated");
    }
    const { currentPassword, newPassword } = await request.json();

    const controller = rootContainer.resolve(UserController);
    const { message } = await controller.changePassword(
      session.user.id,
      currentPassword,
      newPassword
    );

    return ok({ message });
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};
