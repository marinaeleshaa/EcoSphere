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
} from "./order.types";
import { IOrder } from "./order.model";

export interface IOrderService {
	createOrder(orderData: CreateOrderDTO): Promise<IOrder>;
	getUserOrders(userId: string): Promise<IOrder[]>;
	getOrderById(orderId: string): Promise<IOrder>;
	updateOrderStatus(orderId: string, status: OrderStatus): Promise<IOrder>;
	deleteOrder(orderId: string): Promise<IOrder>;
	getRestaurantRevenue(restaurantId: string): Promise<revenuePerRest[]>;
	getBestSellingProducts(): Promise<BestSailingProduct[]>;
	getTopCustomers(): Promise<TopCustomers[]>;
	getDailySales(): Promise<DailySales[]>;
	getActiveRestaurantOrders(restaurantId: string): Promise<IOrder[]>;
	getRevenueByDateRange(
		startDate: string,
		endDate: string
	): Promise<RevenuePerDate[]>;
}

@injectable()
export class OrderService implements IOrderService {
	constructor(
		@inject("OrderRepository")
		private readonly orderRepository: IOrderRepository
	) {}

	async createOrder(orderData: CreateOrderDTO): Promise<IOrder> {
		// Calculate total price
		const totalPrice = orderData.quantity * orderData.productPrice;

		// In a real scenario, you would create the order items array properly
		// This is simplified - you might need to adjust based on your actual data structure
		const order = await this.orderRepository.makeOrder({
			userId: orderData.userId,
			restaurantId: orderData.restaurantId,
			productId: orderData.productId,
			quantity: orderData.quantity,
			totalPrice: totalPrice,
		});
		return order;
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
		status: OrderStatus
	): Promise<IOrder> {
		const updatedOrder = await this.orderRepository.updateOrderStatus(
			orderId,
			status
		);
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
		endDate: string
	): Promise<RevenuePerDate[]> {
		return this.orderRepository.revenueFilteredByDate(startDate, endDate);
	}
}
