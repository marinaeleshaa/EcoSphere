import { rootContainer } from "@/backend/config/container";
import { OrderController } from "@/backend/features/orders/order.controller";
import { ApiResponse, ok, serverError, badRequest } from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/orders/[orderId]/confirm
 * Called from payment success page to mark order as paid and decrease stock
 * This is a fallback for when webhooks don't work (local development)
 */
export const POST = async (
  _req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
): Promise<
  NextResponse<ApiResponse<{ success: boolean; message: string }>>
> => {
  const { orderId } = await context.params;

  if (!orderId) {
    return badRequest("Order ID is required");
  }

  const orderController = rootContainer.resolve(OrderController);

  try {
    // Get order and decrease stock
    const result = await orderController.confirmOrderAndDecreaseStock(orderId);

    if (!result.success) {
      return ok({ success: false, message: result.message });
    }

    return ok({
      success: true,
      message: "Order confirmed and stock decreased",
    });
  } catch (error) {
    console.error("Error confirming order:", error);
    return serverError("Failed to confirm order");
  }
};
