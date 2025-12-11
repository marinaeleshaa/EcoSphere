import { rootContainer } from "@/backend/config/container";
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
): Promise<NextResponse<ApiResponse<IUser>>> => {
  const session = await getCurrentUser();
  if (!session?.id) {
    return unauthorized();
  }

  const controller = rootContainer.resolve(UserController);
  try {
    const result = await controller.getById(session.id, "favoritesIds");
    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};

export const PATCH = async (
  _req: NextRequest
): Promise<NextResponse<ApiResponse<IUser>>> => {
  const session = await getCurrentUser();
  if (!session?.id) {
    return unauthorized();
  }
  const body = await _req.json();
  const { favoritesIds } = body as { favoritesIds?: string };
  const controller = rootContainer.resolve(UserController);

  if (!favoritesIds) {
    return badRequest("Missing favoritesIds");
  }

  try {
    const result = await controller.updateFavorites(session.id, favoritesIds);
    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};
