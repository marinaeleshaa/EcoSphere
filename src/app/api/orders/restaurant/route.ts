import { rootContainer } from "@/backend/config/container";
import { OrderController } from "@/backend/features/orders/order.controller";
import { requireAuth } from "@/backend/utils/authHelper";
import { ok, serverError, unauthorized } from "@/types/api-helpers";
import { NextRequest } from "next/server";

export const GET = async (_req: NextRequest) => {
  try {
    const user = await requireAuth();

    // Check if user is a restaurant or shop
    if (user.role !== "restaurant" && user.role !== "shop") {
      return unauthorized("Only restaurants and shops can access this route");
    }

    const orders = await rootContainer
      .resolve(OrderController)
      .getActiveRestaurantOrders(user.id);

    return ok(orders);
  } catch (error) {
    console.error("Error fetching restaurant orders:", error);
    return serverError("Failed to fetch restaurant orders");
  }
};
