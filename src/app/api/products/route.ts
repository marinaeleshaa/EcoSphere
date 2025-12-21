import { rootContainer } from "@/backend/config/container";
import { ProductController } from "@/backend/features/product/product.controller";
import { ApiResponse, ok, serverError } from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";
import { IProduct } from "@/types/ProductType";

export const GET = async (
  request: NextRequest
): Promise<
  NextResponse<
    ApiResponse<
      | IProduct[]
      | {
          data: IProduct[];
          metadata: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          };
        }
    >
  >
> => {
  const controller = rootContainer.resolve(ProductController);

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");

    const options = {
      ...(page && { page: Number.parseInt(page) }),
      ...(limit && { limit: Number.parseInt(limit) }),
      ...(search && { search }),
      ...(sortBy && {
        sortBy: sortBy as "price" | "title" | "itemRating" | "createdAt",
      }),
      ...(sortOrder && { sortOrder: sortOrder as "asc" | "desc" }),
    };

    const result = await controller.getAll(options);
    console.log("[API /products] Returning paginated products");

    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};
