import { IOrder, OrderModel } from "./order.model";
import { injectable } from "tsyringe";
import { DBInstance } from "@/backend/config/dbConnect";
import {
  revenuePerRest,
  BestSailingProduct,
  TopCustomers,
  DailySales,
  RevenuePerDate,
  updatePayment,
} from "./order.types";

export interface IOrderRepository {
  makeOrder(createOrderDTO: Partial<IOrder>): Promise<IOrder>;
  getOrdersByUser(userId: string): Promise<IOrder[]>;
  getOrderById(orderId: string): Promise<IOrder>;
  updateOrderStatus(
    orderId: string,
    orderNewStatus: updatePayment
  ): Promise<IOrder>;
  deleteOrderById(orderId: string): Promise<IOrder>;

  // Analytics Queries
  revenuePerRestaurant(restaurantId: string): Promise<revenuePerRest[]>;
  bestSellingProducts(): Promise<BestSailingProduct[]>;
  topCustomers(): Promise<TopCustomers[]>;
  dailySales(): Promise<DailySales[]>;
  activeOrdersByRestaurantId(restaurantId: string): Promise<IOrder[]>;
  revenueFilteredByDate(
    startDate: string,
    endDate: string
  ): Promise<RevenuePerDate[]>;
  // Analytics methods for AI chatbot
  getRecentOrders(limit?: number): Promise<IOrder[]>;
  getTotalRevenue(): Promise<number>;
  getOrdersByStatus(
    status: "pending" | "completed" | "cancelled",
    limit?: number
  ): Promise<IOrder[]>;
  atomicUpdateOrderStatus(
    orderId: string,
    expectedStatus: string,
    newStatus: string
  ): Promise<IOrder | null>;
}

@injectable()
export class OrderRepository implements IOrderRepository {
  //
  async makeOrder(order: Partial<IOrder>): Promise<IOrder> {
    await DBInstance.getConnection();
    const savedOrder = await OrderModel.create(order);
    return savedOrder;
  }

  async getOrdersByUser(userId: string): Promise<IOrder[]> {
    await DBInstance.getConnection();
    const orders = await OrderModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean<IOrder[]>()
      .exec();
    return orders;
  }

  async getOrderById(orderId: string): Promise<IOrder> {
    await DBInstance.getConnection();
    const order = await OrderModel.findById(orderId).lean<IOrder>().exec();
    return order!;
  }

  async updateOrderStatus(
    orderId: string,
    orderNewStatus: updatePayment
  ): Promise<IOrder> {
    await DBInstance.getConnection();
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      { _id: orderId },
      { ...orderNewStatus },
      { new: true }
    )
      .lean<IOrder>()
      .exec();
    return updatedOrder!;
  }

  async deleteOrderById(orderId: string): Promise<IOrder> {
    await DBInstance.getConnection();
    const deletedOrder = await OrderModel.findByIdAndDelete({
      _id: orderId,
    })
      .lean<IOrder>()
      .exec();
    return deletedOrder!;
  }

  async revenuePerRestaurant(restaurantId: string) {
    return OrderModel.aggregate([
      { $match: { restaurantId } },
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$restaurantId",
          revenue: { $sum: "$orderPrice" },
          ordersCount: { $count: {} },
        },
      },
    ]).exec();
  }

  async bestSellingProducts(): Promise<BestSailingProduct[]> {
    return OrderModel.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$productId",
          totalQuantity: { $sum: "$quantity" },
          orderCount: { $count: {} },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
    ]);
  }

  async topCustomers(): Promise<TopCustomers[]> {
    return OrderModel.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$userId",
          spent: { $sum: "$total" },
          ordersCount: { $count: {} },
        },
      },
      { $sort: { spent: -1 } },
      { $limit: 10 },
    ]).exec();
  }

  async dailySales(): Promise<DailySales[]> {
    return await OrderModel.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          total: { $sum: "$total" },
          count: { $count: {} },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]).exec();
  }

  async activeOrdersByRestaurantId(restaurantId: string): Promise<IOrder[]> {
    return OrderModel.find({
      $or: [{ restaurantId }, { "items.restaurantId": restaurantId }],
    })
      .sort({ createdAt: -1 })
      .lean<IOrder[]>()
      .exec();
  }

  async revenueFilteredByDate(startDate: string, endDate: string) {
    return await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$total" },
        },
      },
    ]).exec();
  }

  // Analytics methods for AI chatbot
  async getRecentOrders(limit: number = 10): Promise<IOrder[]> {
    return await OrderModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean<IOrder[]>()
      .exec();
  }

  async getTotalRevenue(): Promise<number> {
    const result = await OrderModel.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$orderPrice" },
        },
      },
    ]).exec();

    return result[0]?.totalRevenue || 0;
  }

  async getOrdersByStatus(
    status: "pending" | "completed" | "cancelled",
    limit: number = 20
  ): Promise<IOrder[]> {
    return await OrderModel.find({ status })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean<IOrder[]>()
      .exec();
  }

  /**
   * Atomically update order status only if current status matches expectedStatus.
   * Returns the updated order if successful, null if order not found or status didn't match.
   * This prevents race conditions when multiple requests try to confirm the same order.
   */
  async atomicUpdateOrderStatus(
    orderId: string,
    expectedStatus: string,
    newStatus: string
  ): Promise<IOrder | null> {
    await DBInstance.getConnection();
    const updatedOrder = await OrderModel.findOneAndUpdate(
      {
        _id: orderId,
        status: expectedStatus, // Only update if status matches
      },
      {
        status: newStatus,
        paidAt: newStatus === "paid" ? new Date() : undefined,
      },
      { new: true }
    )
      .lean<IOrder>()
      .exec();
    return updatedOrder;
  }
}
