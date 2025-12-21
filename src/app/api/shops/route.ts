import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import RestaurantController from "@/backend/features/restaurant/restaurant.controller";
import { ApiResponse, created, ok } from "@/types/api-helpers";
import { IShop } from "@/types/ShopTypes";

export const GET = async (): Promise<NextResponse<ApiResponse<IShop[]>>> => {
  const controller = rootContainer.resolve(RestaurantController);
  const result = await controller.getAll();
  return ok(result);
};

export const POST = async (
  req: NextRequest
): Promise<NextResponse<ApiResponse<IShop>>> => {
  const body = await req.json();
  const controller = rootContainer.resolve(RestaurantController);
  const result = await controller.create(body);
  return created(result);
};
