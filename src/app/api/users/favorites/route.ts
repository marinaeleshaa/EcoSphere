import { rootContainer } from "@/backend/config/container";
import { IMenuItem } from "@/backend/features/restaurant/restaurant.model";
import UserController from "@/backend/features/user/user.controller";
import { IUser } from "@/backend/features/user/user.model";
import { getCurrentUser } from "@/backend/utils/authHelper";
import {
  ApiResponse,
  badRequest,
  serverError,
  ok,
  unauthorized,
} from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest
): Promise<NextResponse<ApiResponse<IMenuItem[]>>> => {
  const session = await getCurrentUser();
  if (!session?.id) {
    return unauthorized();
  }

  const controller = rootContainer.resolve(UserController);
  try {
    const { favoritesIds } = await controller.getById(
      session.id,
      "favoritesIds"
    );

    const result = await controller.getFavoriteMenuItems(
      favoritesIds as string[]
    );

    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};

export const PATCH = async (
  _req: NextRequest
): Promise<NextResponse<ApiResponse<IMenuItem[]>>> => {
  const session = await getCurrentUser();
  if (!session?.id) {
    return unauthorized();
  }
  const body = await _req.json();
  const { ids } = body as { ids?: string };
  const controller = rootContainer.resolve(UserController);

  if (!ids) {
    return badRequest("Missing favoritesIds");
  }

  try {
    const { favoritesIds } = await controller.updateFavorites(session.id, ids);

    const result = await controller.getFavoriteMenuItems(
      favoritesIds as string[]
    );
    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};
