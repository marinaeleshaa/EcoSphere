import { Schema, Document, model, ObjectId, Types, models } from "mongoose";
import { OrderStatus, PaymentMethod, IOrderItem } from "./order.types";

export interface IOrder extends Document {
  userId: ObjectId | string;
  items: IOrderItem[];
  paymentMethod: PaymentMethod;
  orderPrice: number; // total for the entire order
  status: OrderStatus;
  stripePaymentIntentId?: string;
  paidAt?: Date;
  paymentProvider?: "stripe" | "paymob" | "fawry";
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Types.ObjectId, required: false }, // embedded MenuItem _id
    restaurantId: { type: Types.ObjectId, ref: "Restaurant", required: false },
    eventId: { type: Types.ObjectId, required: false },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], required: true },
    paymentMethod: {
      type: String,
      enum: ["cashOnDelivery", "paymob", "fawry", "stripe"],
      required: true,
    },
    orderPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "preparing",
        "delivering",
        "completed",
        "canceled",
      ],
      default: "pending",
    },
    stripePaymentIntentId: { type: String },
    paidAt: { type: Date },
    paymentProvider: { type: String, required: false },
  },
  { timestamps: true }
);

// Indexes for performance
orderSchema.index({ restaurantId: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ stripePaymentIntentId: 1 });
orderSchema.index({ productId: 1 });
orderSchema.index({ createdAt: -1 }); // fast pagination + reports

export const OrderModel = models.Order || model<IOrder>("Order", orderSchema);
