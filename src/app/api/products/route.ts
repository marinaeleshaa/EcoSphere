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
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "default";
    const category = searchParams.get("category") || "default";

    const options = {
      page,
      limit,
      search,
      sort: sort as any,
      category,
    };

    const result = await controller.getAll(options);
    console.log("[API /products] Returning paginated products");

    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};
