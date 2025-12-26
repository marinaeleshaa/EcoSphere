import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import RestaurantController from "@/backend/features/restaurant/restaurant.controller";
import { ApiResponse, created, ok } from "@/types/api-helpers";
import { IShop } from "@/types/ShopTypes";
import { getCurrentUser } from "@/backend/utils/authHelper";

export const GET = async (req: NextRequest) => {
  const controller = rootContainer.resolve(RestaurantController);

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const sort = (searchParams.get("sort") as any) || "default";
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "default";
  const statusParam = searchParams.get("status") as any;

  const user = await getCurrentUser();
  const isAdmin = user?.role === "admin";

  // If not admin, always force visible shops only
  const status = isAdmin ? statusParam || "all" : "visible";

  const result = await controller.getAll({
    page,
    limit,
    sort,
    search,
    category: category as any,
    status,
  });

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
