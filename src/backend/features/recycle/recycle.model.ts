import { Document, model, models, Schema } from "mongoose";
import { RecycleOrderStatus } from "./recycle.types";

export interface IAddress {
  city: string;
  neighborhood?: string;
  street: string;
  buildingNumber: string;
  floor: number;
  apartmentNumber?: number;
}

export interface IRecycleItem {
  itemType: string;
  // quantity: number;
  weight: number; // in kilograms
}

export interface IRecycle extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: IAddress;
  recycleItems: IRecycleItem[];
  totalCarbonSaved?: number;
  imageKeys?: string[];
  isVerified?: boolean;
  userId?: string;
  status: RecycleOrderStatus;
  createdAt: Date;
  updatedAt?: Date;
}

export const recycleSchema = new Schema<IRecycle>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: {
      city: { type: String, required: true },
      neighborhood: { type: String },
      street: { type: String, required: true },
      buildingNumber: { type: String, required: true },
      floor: { type: Number, required: true },
      apartmentNumber: { type: Number },
    },
    recycleItems: [
      {
        itemType: { type: String, required: true },
        // quantity: { type: Number, required: true },
        weight: { type: Number, required: true },
      },
    ],
    totalCarbonSaved: { type: Number, default: 0 },
    imageKeys: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    userId: { type: String },
    status: {
      type: String,
      enum: RecycleOrderStatus,
      default: RecycleOrderStatus.PENDING,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const RecycleModel =
  models.Recycle || model<IRecycle>("Recycle", recycleSchema);
