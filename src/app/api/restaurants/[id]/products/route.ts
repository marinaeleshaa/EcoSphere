import { rootContainer } from "@/backend/config/container";
import { ProductController } from "@/backend/features/product/product.controller";
import { IRestaurant } from "@/backend/features/restaurant/restaurant.model";
import {
  ProductResponse,
  CreateProductDTO,
} from "@/backend/features/product/dto/product.dto";
import { ApiResponse, ok, serverError, badRequest } from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<ProductResponse[]>>> => {
  const { id } = await context.params;
  const controller = rootContainer.resolve(ProductController);

  try {
    const result = await controller.getByRestaurantId(id);
    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};

export const POST = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<IRestaurant>>> => {
  const { id } = await context.params;
  const body = await _req.json();
  const controller = rootContainer.resolve(ProductController);

  try {
    const result = await controller.addProduct(id, body);
    return ok(result);
  } catch (error: any) {
    console.error(error);
    return badRequest(error.message || "Failed to add product");
  }
};
