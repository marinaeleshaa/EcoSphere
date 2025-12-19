import { ObjectId, Types } from "mongoose";

// schema types
export type PaymentMethod = "cashOnDelivery" | "paymob" | "fawry" | "stripe";

export type OrderStatus =
  | "pending" // created, not paid
  | "paid" // payment confirmed
  | "preparing"
  | "delivering"
  | "completed"
  | "canceled";

export type updatePayment = {
  status: OrderStatus;
  paidAt?: Date;
  paymentProvider?: string;
};

export type IOrderItem = {
  restaurantId?: ObjectId | string;
  productId?: ObjectId | string;
  eventId?: ObjectId | string;
  quantity: number;
  unitPrice: number;
  totalPrice: number; // total of these items
};

// input / outputs types
export type CreateOrderDTO = {
  userId: string;
  paymentMethod: PaymentMethod;
  items: OrderRequestItem[];
};

export type OrderSuccess = {
  orderId: string;
  stripePaymentIntentId: string;
  paidAmount: number;
};

export type OrderRequestItem = {
  restaurantId?: Types.ObjectId | string;
  productId?: string;
  eventId?: string;
  quantity: number;
};

export type CreateOrderCommand = {
  totalPrice: number;
} & OrderRequestItem & { price: number };

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
