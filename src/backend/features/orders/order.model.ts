import mongoose, { Schema, Document, model, ObjectId, Types } from "mongoose";
import { OrderStatus, PaymentMethod, IOrderItem } from "./order.types";

export interface IOrder extends Document {
	userId: ObjectId;
	restaurantId: ObjectId;
	items: IOrderItem[];
	paymentMethod: PaymentMethod;
	orderPrice: number; // total for the entire order
	status: OrderStatus;
}

const orderItemSchema = new Schema<IOrderItem>(
	{
		productId: { type: Types.ObjectId, ref: "MenuItem", required: true },
		quantity: { type: Number, required: true },
		unitPrice: { type: Number, required: true },
		totalPrice: { type: Number, required: true },
	},
	{ _id: false }
);

const orderSchema = new Schema<IOrder>(
	{
		userId: { type: Types.ObjectId, ref: "User", required: true },
		restaurantId: { type: Types.ObjectId, ref: "Restaurant", required: true },
		items: { type: [orderItemSchema], required: true },
		paymentMethod: {
			type: String,
			enum: ["cashOnDelivery", "paymob", "fawry", "stripe"],
			required: true,
		},
		orderPrice: { type: Number, required: true },
		status: {
			type: String,
			enum: ["pending", "preparing", "delivering", "completed", "canceled"],
			default: "pending",
		},
	},
	{ timestamps: true }
);

// Indexes for performance
orderSchema.index({ restaurantId: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ productId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 }); // fast pagination + reports

export const OrderModel =
	mongoose.models.Order || model<IOrder>("Order", orderSchema);
