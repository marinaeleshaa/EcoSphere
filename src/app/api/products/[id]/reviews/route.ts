import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import { ProductController } from "@/backend/features/product/product.controller";
import {
  ApiResponse,
  ok,
  badRequest,
  serverError,
  unauthorized,
  notFound,
} from "@/types/api-helpers";
import { IReview } from "@/types/ShopTypes";
import { getCurrentUser } from "@/backend/utils/authHelper";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<IReview[]>>> => {
  try {
    const { id } = await context.params;

    const controller = rootContainer.resolve(ProductController);
    const product = await controller.getById(id);

    if (!product) {
      return notFound("Product not found");
    }

    return ok(product.itemRating || []);
  } catch (error) {
    console.error("Error getting product reviews:", error);

    return serverError(
      error instanceof Error ? error.message : "Failed to get reviews"
    );
  }
};

export const POST = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await context.params;
    const user = await getCurrentUser();
    if (!user?.id) return unauthorized();

    const body = await req.json();
    const { rating, review } = body;

    if (!rating) return badRequest("Rating is required");
    if (rating < 1 || rating > 5)
      return badRequest("Rating must be between 1 and 5");

    const controller = rootContainer.resolve(ProductController);

    // Check if product exists
    const product = await controller.getById(id);
    if (!product) return notFound("Product not found");

    const newRating: IReview = {
      userId: user.id,
      rate: rating,
      review: review || "",
    };

    const result = await controller.addProductReview(id, newRating);

    if (!result) {
      return serverError("Failed to add review");
    }

    return ok(newRating);
  } catch (error) {
    console.error("Error adding product review:", error);
    return serverError(
      error instanceof Error ? error.message : "Failed to add review"
    );
  }
};
