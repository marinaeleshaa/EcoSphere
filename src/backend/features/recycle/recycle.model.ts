import { Document, model, models, Schema } from "mongoose";

export interface IAddress {
	city: string;
	nighborhood?: string;
	street: string;
	buildingNumber: string;
	floor: number;
	apartmentNumber?: number;
}

export interface IRecycleItem {
	itemType: string;
	quantity: number;
	weight: number; // in kilograms
}

export interface IRecycle extends Document {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	address: IAddress;
	recycleItems: IRecycleItem[];
}

export const recycleSchema = new Schema<IRecycle>(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true },
		phoneNumber: { type: String, required: true },
		address: {
			city: { type: String, required: true },
			nighborhood: { type: String },
			street: { type: String, required: true },
			buildingNumber: { type: String, required: true },
			floor: { type: Number, required: true },
			apartmentNumber: { type: Number },
		},
		recycleItems: [
			{
				itemType: { type: String, required: true },
				quantity: { type: Number, required: true },
				weight: { type: Number, required: true },
			},
		],
	},
	{ timestamps: true }
);

export const RecycleModel =
	models.recycle || model<IRecycle>("Recycle", recycleSchema);
