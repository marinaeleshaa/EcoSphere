import { IOrder, OrderModel } from "./order.model";
import { injectable } from "tsyringe";
import { DBInstance } from "@/backend/config/dbConnect";
import {
	CreateOrderCommand,
	revenuePerRest,
	BestSailingProduct,
	TopCustomers,
	DailySales,
	RevenuePerDate,
	OrderStatus,
} from "./order.types";

export interface IOrderRepository {
	makeOrder(createOrderDTO: CreateOrderCommand): Promise<IOrder>;
	getOrdersByUser(userId: string): Promise<IOrder[]>;
	getOrderById(orderId: string): Promise<IOrder>;
	updateOrderStatus(
		orderId: string,
		orderNewStatus: OrderStatus
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
}

@injectable()
export class OrderRepository implements IOrderRepository {
	//
	async makeOrder(order: CreateOrderCommand): Promise<IOrder> {
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
		orderNewStatus: OrderStatus
	): Promise<IOrder> {
		await DBInstance.getConnection();
		const updatedOrder = await OrderModel.findByIdAndUpdate(
			{ _id: orderId },
			{ orderNewStatus },
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
			restaurantId,
			status: { $in: ["pending"] },
		})
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
}
