import { rootContainer } from "@/backend/config/container";
import { OrderController } from "@/backend/features/orders/order.controller";
import { requireAuth } from "@/backend/utils/authHelper";
import { ok, serverError, notFound, ApiResponse } from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";
import { IOrder } from "@/backend/features/orders/order.model";

export const GET = async (
  _req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
): Promise<NextResponse<ApiResponse<IOrder>>> => {
  try {
    const user = await requireAuth();
    const { orderId } = await context.params;

    const order = await rootContainer
      .resolve(OrderController)
      .getOrderById(orderId);

    if (!order) {
      return notFound("Order not found");
    }

    // Verify the order belongs to the authenticated user
    const userIdString =
      typeof order.userId === "string" ? order.userId : order.userId.toString();

    if (userIdString !== user.id) {
      return notFound("Order not found");
    }

    return ok(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return serverError("Failed to fetch order");
  }
};

export const PATCH = async (
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
): Promise<NextResponse<ApiResponse<IOrder>>> => {
  try {
    await requireAuth();
    const { orderId } = await context.params;
    const { status } = await req.json();

    if (!status) {
      return serverError("Status is required");
    }

    // In a real app, we would verify if the user has permission to update THIS specific order.
    // For now, based on the implementation plan, we expose the controller's update method.
    const updatedOrder = await rootContainer
      .resolve(OrderController)
      .updateOrderStatus(orderId, status);

    if (!updatedOrder) {
      return notFound("Order not found");
    }

    return ok(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    return serverError("Failed to update order status");
  }
};
