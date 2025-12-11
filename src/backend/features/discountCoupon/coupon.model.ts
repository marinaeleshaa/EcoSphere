import { Document, model, models, Schema } from "mongoose";

export interface ICoupon extends Document {
	code: string;
	rate: number;
	validTo: Date;
	numberOfUse: number;
	maxNumberOfUse: number;
}

const couponsSchema = new Schema<ICoupon>(
	{
		code: { type: String, required: true, unique: true },
		rate: { type: Number, required: true },
		validTo: { type: Date, required: true },
		numberOfUse: { type: Number, required: true },
		maxNumberOfUse: { type: Number, required: true },
	},
	{ timestamps: true }
);

export const CouponModel =
	models.Coupon || model<ICoupon>("Coupon", couponsSchema);
