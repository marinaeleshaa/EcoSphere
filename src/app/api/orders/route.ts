import { rootContainer } from "@/backend/config/container";
import { OrderController } from "@/backend/features/orders/order.controller";
import { OrderService } from "@/backend/features/orders/order.service";
import { requireAuth } from "@/backend/utils/authHelper";
import { ok, serverError } from "@/types/api-helpers";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const { items, paymentMethod, orderStatus } = await req.json();
  try {
    const user = await requireAuth();
    const orderController = rootContainer.resolve(OrderController);
    const orderService = rootContainer.resolve(OrderService);

    const order = await orderController.createOrder({
      items,
      userId: user.id,
      paymentMethod,
      status: orderStatus,
    });

    // Decrease stock immediately for Cash on Delivery orders
    // (Stripe orders decrease stock via /api/orders/[orderId]/confirm after payment)
    if (paymentMethod === "cashOnDelivery" && order) {
      const stockItems = order.items.map((item: any) => ({
        id: item.productId || item.id,
        quantity: item.quantity,
        restaurantId: item.restaurantId,
      }));

      await orderService.decreaseStockForOrder(stockItems);
      console.log("✅ Stock decreased for COD order:", order._id);
    }

    return ok(order);
  } catch (error) {
    console.error(error);
    return serverError();
  }
};

export const GET = async () => {
  try {
    const user = await requireAuth();
    const orders = await rootContainer
      .resolve(OrderController)
      .getUserOrders(user.id);
    return ok(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return serverError("Failed to fetch orders");
  }
};
