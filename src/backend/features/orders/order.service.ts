import { inject, injectable } from "tsyringe";
import { type IOrderRepository } from "./order.repository";
import {
  revenuePerRest,
  BestSailingProduct,
  TopCustomers,
  DailySales,
  RevenuePerDate,
  OrderStatus,
  CreateOrderDTO,
  IOrderItem,
} from "./order.types";
import { IOrder } from "./order.model";
import type { IUserService } from "../user/user.service";
import type { IEventService } from "../event/event.service";
import Stripe from "stripe";

export interface IOrderService {
  createOrder(userId: string, orderData: CreateOrderDTO): Promise<IOrder>;
  getUserOrders(userId: string): Promise<IOrder[]>;
  getOrderById(orderId: string): Promise<IOrder>;
  handleStripeEvent(event: Stripe.Event): Promise<void>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<IOrder>;
  deleteOrder(orderId: string): Promise<IOrder>;
  getRestaurantRevenue(restaurantId: string): Promise<revenuePerRest[]>;
  getBestSellingProducts(): Promise<BestSailingProduct[]>;
  getTopCustomers(): Promise<TopCustomers[]>;
  getDailySales(): Promise<DailySales[]>;
  getActiveRestaurantOrders(restaurantId: string): Promise<IOrder[]>;
  getRevenueByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<RevenuePerDate[]>;
}

@injectable()
export class OrderService implements IOrderService {
  constructor(
    @inject("OrderRepository")
    private readonly orderRepository: IOrderRepository,
    @inject("IUserService") private readonly userService: IUserService,
    @inject("IEventService") private readonly eventService: IEventService,
  ) {}

  async createOrder(
    userId: string,
    orderData: CreateOrderDTO,
  ): Promise<IOrder> {
    if (orderData.items.length > 0 && orderData.items[0].eventId) {
      const item = orderData.items[0];
      const eventId = item.eventId as string;
      const event = await this.eventService.getEventById(userId, eventId);
      if (!event) throw new Error("Event not found");

      const orderItem: IOrderItem = {
        eventId: eventId,
        quantity: 1,
        unitPrice: event.ticketPrice,
        totalPrice: event.ticketPrice,
      };

      const orderNewData = {
        userId,
        items: [orderItem],
        orderPrice: event.ticketPrice,
        paymentMethod: orderData.paymentMethod,
      };

      return await this.orderRepository.makeOrder(orderNewData);
    }

    const userCart = await this.userService.getCart(userId);

    if (!userCart || userCart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const orderItems: IOrderItem[] = orderData.items.map((item) => {
      const cartItem = userCart.items.find(
        (ci) => `${ci.id}` === `${item.productId}`,
      );

      if (!cartItem) {
        throw new Error(`Product ${item.productId} not found in cart`);
      }

      const unitPrice = cartItem.productPrice;
      const totalPrice = unitPrice * item.quantity;

      return {
        restaurantId: `${item.restaurantId}`,
        productId: `${item.productId}`,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      };
    });

    const orderPrice = orderItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    const orderNewData = {
      userId,
      items: orderItems,
      orderPrice,
      paymentMethod: orderData.paymentMethod,
      // status will be default (e.g. PENDING)
    };

    const order = await this.orderRepository.makeOrder(orderNewData);
    await this.userService.saveUserCart(userId, []);
    return order;
  }

  async handleStripeEvent(event: Stripe.Event): Promise<void> {
    console.log(event, "event");
    const intent = event.data.object as Stripe.PaymentIntent;
    switch (event.type) {
      case "payment_intent.succeeded": {
        const orderId = intent.metadata.orderId;
        if (!orderId) return;
        console.log(intent.metadata, "metaData");

        // Note: Frontend confirmation is authoritative for UX (cart cleared on success).
        // This webhook ensures server-side order status consistency and audit trail.
        // If webhook fails, order stays in 'pending' but payment is confirmed client-side.
        const order = await this.orderRepository.getOrderById(orderId);
        if (order) {
          for (const item of order.items) {
            if (item.eventId) {
              await this.eventService.attendEvent(
                order.userId.toString(),
                item.eventId.toString(),
              );
            }
          }
        }

        await this.orderRepository.updateOrderStatus(orderId, {
          status: "preparing",
          paidAt: new Date(intent.created),
          paymentProvider: "stripe",
        });
        break;
      }
      case "payment_intent.payment_failed": {
        const orderId = intent.metadata.orderId;
        if (!orderId) return;
        await this.orderRepository.updateOrderStatus(orderId, {
          status: "canceled",
        });
        break;
      }
      default:
        // ignore other events
        break;
    }
  }

  async getUserOrders(userId: string): Promise<IOrder[]> {
    return this.orderRepository.getOrdersByUser(userId);
  }

  async getOrderById(orderId: string): Promise<IOrder> {
    const order = await this.orderRepository.getOrderById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<IOrder> {
    const updatedOrder = await this.orderRepository.updateOrderStatus(orderId, {
      status,
    });
    if (!updatedOrder) {
      throw new Error("Order not found");
    }
    return updatedOrder;
  }

  async deleteOrder(orderId: string): Promise<IOrder> {
    const deletedOrder = await this.orderRepository.deleteOrderById(orderId);
    if (!deletedOrder) {
      throw new Error("Order not found");
    }
    return deletedOrder;
  }

  async getRestaurantRevenue(restaurantId: string): Promise<revenuePerRest[]> {
    return this.orderRepository.revenuePerRestaurant(restaurantId);
  }

  async getBestSellingProducts(): Promise<BestSailingProduct[]> {
    return this.orderRepository.bestSellingProducts();
  }

  async getTopCustomers(): Promise<TopCustomers[]> {
    return this.orderRepository.topCustomers();
  }

  async getDailySales(): Promise<DailySales[]> {
    return this.orderRepository.dailySales();
  }

  async getActiveRestaurantOrders(restaurantId: string): Promise<IOrder[]> {
    return this.orderRepository.activeOrdersByRestaurantId(restaurantId);
  }

  async getRevenueByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<RevenuePerDate[]> {
    return this.orderRepository.revenueFilteredByDate(startDate, endDate);
  }
  // private getCartTotal = (items: IProductCart[]) =>
  // 	items.reduce(
  // 		(sum, { productPrice, quantity }) => sum + productPrice * quantity,
  // 		0
  // 	);
}
