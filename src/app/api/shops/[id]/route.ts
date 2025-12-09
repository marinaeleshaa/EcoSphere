import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import RestaurantController from "@/backend/features/restaurant/restaurant.controller";
import { ApiResponse, ok, serverError } from "@/types/api-helpers";
import { IRestaurant } from "@/backend/features/restaurant/restaurant.model";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<IRestaurant>>> => {
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
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<IRestaurant>>> => {
  const { id } = await context.params;
  const body = await req.json();
  const controller = rootContainer.resolve(RestaurantController);
  try {
    const result = await controller.updateById(id, body);
    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};

export const DELETE = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const { id } = await context.params;
  const controller = rootContainer.resolve(RestaurantController);
  try {
    const result = await controller.deleteById(id);
    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};
