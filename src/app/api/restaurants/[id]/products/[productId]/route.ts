import { rootContainer } from "@/backend/config/container";
import { ProductController } from "@/backend/features/product/product.controller";
import { IRestaurant } from "@/backend/features/restaurant/restaurant.model";
import { ApiResponse, ok, badRequest } from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string; productId: string }> }
): Promise<NextResponse<ApiResponse<IRestaurant>>> => {
  const { id, productId } = await context.params;
  const body = await _req.json();
  const controller = rootContainer.resolve(ProductController);

  try {
    const result = await controller.updateProduct(id, productId, body);
    return ok(result);
  } catch (error: any) {
    console.error(error);
    return badRequest(error.message || "Failed to update product");
  }
};

export const DELETE = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string; productId: string }> }
): Promise<NextResponse<ApiResponse<IRestaurant>>> => {
  const { id, productId } = await context.params;
  const controller = rootContainer.resolve(ProductController);

  try {
    const result = await controller.deleteProduct(id, productId);
    return ok(result);
  } catch (error: any) {
    console.error(error);
    return badRequest(error.message || "Failed to delete product");
  }
};
