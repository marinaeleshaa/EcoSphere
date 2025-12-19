import { rootContainer } from "@/backend/config/container";
import { ProductController } from "@/backend/features/product/product.controller";
import { IProduct } from "@/types/ProductType";
import { ApiResponse, ok, serverError, notFound } from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<IProduct>>> => {
  const { id } = await context.params;
  const controller = rootContainer.resolve(ProductController);

  try {
    const result = await controller.getById(id);
    if (!result) return notFound("Product not found");
    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};
