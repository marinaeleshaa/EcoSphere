import { Gender, UserRole } from "@/backend/interfaces/interfaces";
import mongoose, { model, Schema } from "mongoose";

export interface IUser {
	_id?: string;
	email: string;
	name: string;
	passwordHash: string;
	phoneNumber: string;
	address: string;
	avatar?: string;
	birthDate: string;
	gender: Gender;
	points: number;
	role: UserRole;
	favoritesIds: string[];
	reviewsIds: string[];
	createdAt?: Date;
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
	{
		email: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		passwordHash: { type: String, required: true },
		phoneNumber: { type: String, required: true },
		address: { type: String, required: true },
		avatar: { type: String, required: false },
		birthDate: { type: String, required: true },
		gender: { type: String, enum: Object.values(Gender), required: true },
		points: { type: Number, default: 1000 },
		role: {
			type: String,
			enum: Object.values(UserRole),
			default: UserRole.CUSTOMER,
		},
		favoritesIds: { type: [String], default: [] },
		reviewsIds: { type: [String], default: [] },
	},
	{ timestamps: true }
);

export const UserModel =
	mongoose.models.User || model<IUserDocument>("User", userSchema);
