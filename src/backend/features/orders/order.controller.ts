import { inject, injectable } from "tsyringe";
import { type IOrderService } from "./order.service";
import { CreateOrderDTO, OrderStatus } from "./order.types";
import Stripe from "stripe";

@injectable()
export class OrderController {
  constructor(
    @inject("OrderService") private readonly orderService: IOrderService
  ) {}

  async createOrder(order: CreateOrderDTO) {
    if (!order) return;
    const savedOrder = await this.orderService.createOrder(order.userId, order);
    if (!savedOrder) return;
    return savedOrder;
  }

  async handleStripeEvent(event: Stripe.Event) {
    // Handle checkout session completed - this fires when payment succeeds
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Only process if payment was successful
      if (session.payment_status !== "paid") {
        return;
      }

      // Extract metadata
      const metadata = session.metadata;
      if (!metadata) {
        console.error("❌ Missing metadata in checkout session");
        return;
      }

      const items = JSON.parse(metadata.items || "[]");

      if (!items || items.length === 0) {
        console.error("❌ No items found in metadata");
        return;
      }

      try {
        // Decrease stock for each item (order already created in PaymentService)
        await this.orderService.decreaseStockForOrder(items);
      } catch (error) {
        console.error("❌ Error decreasing stock:", error);
      }
    }
  }

  async getUserOrders(userId: string) {
    if (!userId) return;
    const orders = await this.orderService.getUserOrders(userId);
    return orders;
  }

  async getOrderById(orderId: string) {
    if (!orderId) return;
    const order = await this.orderService.getOrderById(orderId);
    return order;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    if (!orderId || !status) return;
    const updatedOrder = await this.orderService.updateOrderStatus(
      orderId,
      status
    );
    return updatedOrder;
  }

  async deleteOrder(orderId: string) {
    if (!orderId) return;
    const deletedOrder = await this.orderService.deleteOrder(orderId);
    return deletedOrder;
  }

  async getRestaurantRevenue(restaurantId: string) {
    return await this.orderService.getRestaurantRevenue(restaurantId);
  }

  async getBestSellingProducts() {
    return await this.orderService.getBestSellingProducts();
  }

  async getTopCustomers() {
    return await this.orderService.getTopCustomers();
  }

  async getDailySales() {
    return await this.orderService.getDailySales();
  }

  async getActiveRestaurantOrders(restaurantId: string) {
    return await this.orderService.getActiveRestaurantOrders(restaurantId);
  }
  async getRevenueByDateRange(startDate: string, endDate: string) {
    return await this.orderService.getRevenueByDateRange(startDate, endDate);
  }

  /**
   * Confirm order payment and decrease stock
   * Called from payment success page as webhook fallback for local development
   * Uses atomic update to prevent double processing from React Strict Mode
   */
  async confirmOrderAndDecreaseStock(
    orderId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Atomically update status from pending to paid
      // This prevents race conditions when called twice (React Strict Mode)
      const updatedOrder = await this.orderService.atomicConfirmOrder(orderId);

      if (!updatedOrder) {
        // Either order not found OR already processed
        console.log(
          "⏩ Order already processed or not found, skipping stock decrease"
        );
        return {
          success: true,
          message: "Order already confirmed or not found",
        };
      }

      // Prepare items for stock decrease
      const items = updatedOrder.items.map((item: any) => ({
        id: item.productId || item.id,
        quantity: item.quantity,
        restaurantId: item.restaurantId,
      }));

      // Debug logging
      console.log(
        "📦 Order items for stock decrease:",
        JSON.stringify(items, null, 2)
      );

      // Decrease stock
      await this.orderService.decreaseStockForOrder(items);
      console.log("✅ Stock decreased for order:", orderId);

      // Add attendees for event tickets
      await this.orderService.addOrderAttendees(updatedOrder);

      return { success: true, message: "Order confirmed and stock decreased" };
    } catch (error) {
      console.error("❌ Error confirming order:", error);
      return { success: false, message: "Failed to confirm order" };
    }
  }
}
