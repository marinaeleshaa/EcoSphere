import { rootContainer } from "@/backend/config/container";
import { ProductController } from "@/backend/features/product/product.controller";
import { ApiResponse, ok, serverError } from "@/types/api-helpers";
import { NextResponse } from "next/server";
import { IProduct } from "@/types/ProductType";

export const GET = async (): Promise<NextResponse<ApiResponse<IProduct[]>>> => {
  const controller = rootContainer.resolve(ProductController);

  try {
    const result = await controller.getAll();
    console.log("[API /products] Returning", result.length, "products");
    if (result.length > 0) {
      console.log("[API /products] Sample product:", {
        id: result[0].id,
        productName: result[0].productName,
        productImg: result[0].productImg || "EMPTY",
        hasImg: !!result[0].productImg,
      });
    }
    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};
