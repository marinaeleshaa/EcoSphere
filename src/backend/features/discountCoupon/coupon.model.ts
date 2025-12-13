import { Document, model, models, Schema, Types } from "mongoose";
import { CouponCreationType } from "./coupon.types";

export interface ICoupon extends Document {
	code: string;
	rate: number;
	validTo: Date;
	numberOfUse: number;
	maxNumberOfUse: number;
	createdBy: Types.ObjectId | string;
	source: CouponCreationType;
}

const couponsSchema = new Schema<ICoupon>(
	{
		code: { type: String, required: true, unique: true },
		rate: { type: Number, required: true },
		validTo: { type: Date, required: true },
		numberOfUse: { type: Number, required: true, default: 0 },
		maxNumberOfUse: { type: Number, required: true },
		createdBy: { type: Types.ObjectId, ref: "User", required: true },
		source: {
			type: String,
			enum: ["redeem", "manual", "marketing"],
			default: "redeem",
		},
	},
	{ timestamps: true }
);

export const CouponModel =
	models.Coupon || model<ICoupon>("Coupon", couponsSchema);
