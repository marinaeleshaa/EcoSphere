import { model, Schema } from "mongoose";

export interface IUser {
	_id?: string;
	email: string;
	name: string;
	passwordHash: string;
	createdAt?: Date;
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
	{
		email: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		passwordHash: { type: String, required: true },
	},
	{ timestamps: true }
);

export const UserModel = model<IUserDocument>("User", userSchema);
