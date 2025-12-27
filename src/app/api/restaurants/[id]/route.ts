import { rootContainer } from "@/backend/config/container";
import RestaurantController from "@/backend/features/restaurant/restaurant.controller";
import { getCurrentUser } from "@/backend/utils/authHelper";
import {
  ApiResponse,
  ok,
  serverError,
  unauthorized,
} from "@/types/api-helpers";
import { IShop } from "@/types/ShopTypes";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<IShop>>> => {
  const { id } = await context.params;
  const controller = rootContainer.resolve(RestaurantController);
  try {
    const result = await controller.getById(id);
    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};

export const PUT = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<IShop>>> => {
  const session = await getCurrentUser();
  if (!session?.id) {
    return unauthorized();
  }

  const { id } = await context.params;

  // Verify the user is updating their own profile
  if (session.id !== id) {
    return unauthorized();
  }

  const body = await _req.json();
  const controller = rootContainer.resolve(RestaurantController);

  try {
    const result = await controller.updateById(id, body);
    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};
