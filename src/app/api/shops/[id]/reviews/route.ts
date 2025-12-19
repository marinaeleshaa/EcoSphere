import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import RestaurantController from "@/backend/features/restaurant/restaurant.controller";
import {
  ApiResponse,
  ok,
  badRequest,
  serverError,
  unauthorized,
} from "@/types/api-helpers";
import { IReview } from "@/types/ShopTypes";
import { IRestaurant } from "@/backend/features/restaurant/restaurant.model";
import { getCurrentUser } from "@/backend/utils/authHelper";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<IReview[]>>> => {
  try {
    const { id } = await context.params;

    const controller = rootContainer.resolve(RestaurantController);
    const shop = await controller.getById(id);

    return ok(shop.restaurantRating || []);
  } catch (error) {
    console.error("Error getting reviews:", error);

    return serverError(
      error instanceof Error ? error.message : "Failed to get reviews"
    );
  }
};

export const POST = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const { id } = await context.params;
  const user = await getCurrentUser();
  if (!user?.id) return unauthorized();

  const body = await req.json();
  const { rating, review } = body;

  if (!rating) return badRequest("Rating is required");
  if (rating < 1 || rating > 5)
    return badRequest("Rating must be between 1 and 5");

  const controller = rootContainer.resolve(RestaurantController);
  const shop = await controller.getById(id);

  const newRating: IReview = {
    userId: user.id,
    rate: rating,
    review: review || "",
  };

  await controller.updateById(id, {
    restaurantRating: [...(shop.restaurantRating || []), newRating],
  } as unknown as Partial<IRestaurant>);

  return ok(newRating);
};
