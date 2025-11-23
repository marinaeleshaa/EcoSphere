import mongoose, { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IRating extends Document {
	userId: string;
	rate: number;
	review?: string;
}

export interface IMenuItem extends Document {
	title: string;
	subtitle: string;
	price: number;
	avatar?: string;
	availableOnline: boolean;
	itemRating: IRating[];
}

export interface IRestaurant extends Document {
	_id?: string;
	name: string;
	email: string;
	password: string;
	locate: string;
	workingHours: string;
	phoneNumber: string;
	description: string;
	subscribed: boolean;
	subscriptionPeriod: Date;
	menus?: IMenuItem[];
	restaurantRating?: IRating[];
	avatar?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export const ratingSchema = new Schema<IRating>(
	{
		userId: { type: String, required: true },
		rate: { type: Number, required: true },
		review: { type: String, required: false },
	},
	{ _id: false }
);

export const menuItemSchema = new Schema<IMenuItem>({
	title: { type: String, required: true },
	subtitle: { type: String, required: true },
	price: { type: Number, required: true },
	avatar: { type: String, required: false },
});

const restaurantSchema = new Schema<IRestaurant>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		location: { type: String, required: true },
		workingHours: { type: String, required: true },
		phoneNumber: { type: String, required: true },
		avatar: { type: String, required: false },
		description: { type: String, required: true },
		subscribed: { type: Boolean, default: false },
		subscriptionPeriod: { type: Date, required: false },
		menus: { type: [menuItemSchema], default: [] },
		restaurantRating: { type: [ratingSchema], default: [] },
	},
	{ timestamps: true }
);

restaurantSchema.pre("save", async function (next) {
	this.createdAt ??= new Date();
	if (!this.isModified("password")) next();

	this.password = await bcrypt.hash(this.password, 10);
	next();
});

restaurantSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	return await bcrypt.compare(candidatePassword, this.password);
};

export const RestaurantModel =
	mongoose.models.Restaurant ||
	model<IRestaurant>("Restaurant", restaurantSchema);
