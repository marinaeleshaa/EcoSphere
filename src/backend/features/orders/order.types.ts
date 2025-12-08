import { ObjectId } from "mongoose";

// schema types
export type PaymentMethod = "cashOnDelivery" | "paymob" | "fawry" | "stripe";

export type OrderStatus =
	| "pending"
	| "preparing"
	| "delivering"
	| "completed"
	| "canceled";

export type IOrderItem = {
	productId: ObjectId;
	quantity: number;
	unitPrice: number;
	totalPrice: number; // total of these items
};

// input / outputs types
export type CreateOrderDTO = {
	userId: ObjectId;
	restaurantId: ObjectId;
	productId: ObjectId;
	quantity: number;
	productPrice: number;
};

export type CreateOrderCommand = {
	userId: ObjectId;
	restaurantId: ObjectId;
	productId: ObjectId;
	quantity: number;
	totalPrice: number;
};

export type revenuePerRest = {
	_id: ObjectId;
	revenue: number;
	ordersCount: number;
};

export type BestSailingProduct = {
	_id: ObjectId;
	totalQuantity: number;
	orderCount: number;
};

export type TopCustomers = {
	_id: ObjectId;
	spent: number;
	orderCount: number;
};

export type DailySales = {
	_id: { year: number; month: number; day: number };
	total: number;
	count: number;
};

export type RevenuePerDate = {
	_id: null;
	total: number;
};
