import { rootContainer } from "@/backend/config/container";
import { ProductController } from "@/backend/features/product/product.controller";
import { IRestaurant } from "@/backend/features/restaurant/restaurant.model";
import {
  ProductResponse,
  PaginatedProductResponse,
} from "@/backend/features/product/dto/product.dto";
import { ApiResponse, ok, serverError } from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<
  NextResponse<ApiResponse<PaginatedProductResponse | ProductResponse[]>>
> => {
  const { id } = await context.params;
  const controller = rootContainer.resolve(ProductController);

  // Extract Query Params
  const searchParams = _req.nextUrl.searchParams;
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : undefined;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!)
    : undefined;
  const search = searchParams.get("search") || undefined;
  const category = (searchParams.get("category") as any) || undefined;
  const sort = (searchParams.get("sort") as any) || undefined;
  const sortOrder = (searchParams.get("sortOrder") as any) || undefined;

  try {
    const result = await controller.getByRestaurantId(id, {
      page,
      limit,
      search,
      category,
      sort,
      sortOrder,
    });
    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};

export const POST = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse<IRestaurant>>> => {
  const { id } = await context.params;
  const body = await _req.json();
  const controller = rootContainer.resolve(ProductController);

  try {
    const result = await controller.addProduct(id, body);
    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};
