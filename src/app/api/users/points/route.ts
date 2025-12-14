import { rootContainer } from "@/backend/config/container";
import UserController from "@/backend/features/user/user.controller";
import { IUser } from "@/backend/features/user/user.model";
import { getCurrentUser } from "@/backend/utils/authHelper";
import {
  ApiResponse,
  ok,
  serverError,
  unauthorized,
} from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest
): Promise<NextResponse<ApiResponse<IUser>>> => {
  const user = await getCurrentUser();

  if (!user?.id) {
    return unauthorized();
  }

  const body = await req.json();
  const controller = rootContainer.resolve(UserController);

  try {
    const currentUser = await controller.getById(user.id, "points");

    if (!currentUser) {
      return serverError("User not found");
    }

    const pointsToAdd = Number(body.points) || 0;

    const result = await controller.updateById(user.id, {
      points: (currentUser.points || 0) + pointsToAdd,
    });

    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};
