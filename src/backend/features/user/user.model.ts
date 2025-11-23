import mongoose, { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export enum UserRole {
	CUSTOMER = "customer",
	Organizer = "organizer",
	ADMIN = "admin",
}

export enum Gender {
	MALE = "male",
	FEMALE = "female",
}

export interface ISection extends Document {
	title: string;
	subtitle: string;
	description: string;
}

export interface IEvent extends Document {
	name: string;
	locate: string;
	ticketPrice: number;
	avatar: string;
	viewers: string[];
	capacity: number;
	sections: ISection[];
}

export interface IUser extends Document {
	_id?: string;
	email: string;
	firstName: string;
	lastName: string;
	password: string;
	phoneNumber: string;
	birthDate: string;
	gender: Gender;
	points: number;
	role: UserRole;
	subscribed?: boolean;
	address?: string;
	avatar?: string;
	favoritesIds?: string[];
	cart?: string[];
	paymentHistory?: string[];
	events?: IEvent[];
	createdAt?: Date;
	updatedAt?: Date;
	comparePassword(candidatePassword: string): Promise<boolean>;
}

export const sectionsSchema = new Schema<ISection>(
	{
		title: { type: String, required: true },
		subtitle: { type: String, required: true },
		description: { type: String, required: true },
	},
	{ _id: false }
);

export const eventSchema = new Schema<IEvent>(
	{
		name: { type: String, required: true },
		locate: { type: String, required: true },
		ticketPrice: { type: Number, required: true },
		avatar: { type: String, required: true },
		viewers: { type: [String], default: [] },
		capacity: { type: Number, required: true },
		sections: { type: [sectionsSchema], default: [] },
	},
	{ _id: true }
);

const userSchema = new Schema<IUser>(
	{
		email: { type: String, required: true, unique: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		password: { type: String, required: true, select: false },
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
		cart: { type: [String], default: [] },
		paymentHistory: { type: [String], default: [] },
		events: { type: [eventSchema], default: [] },
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next): Promise<void> {
	this.createdAt ??= new Date();
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	console.log(candidatePassword);
	return await bcrypt.compare(candidatePassword, this.password);
};

export const UserModel =
	mongoose.models.User || model<IUser>("User", userSchema);
