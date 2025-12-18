import { Document, model, models, Schema, Types } from "mongoose";
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
  avatar?: {
    key: string;
    url?: string;
  };
  sustainabilityScore?: number;
  sustainabilityReason?: string;
  availableOnline: boolean;
  itemRating?: Types.DocumentArray<IRating>;
}

export interface IRestaurant extends Document {
  name: string; // needed
  email: string;
  password: string;
  location: string;
  workingHours: string;
  phoneNumber: string;
  description: string;
  subscribed: boolean;
  subscriptionPeriod?: Date;
  stripeCustomerId?: string;
  menus?: Types.DocumentArray<IMenuItem>;
  restaurantRating?: IRating[];
  avatar?: {
    key: string;
    url?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
  isHidden: boolean; // needed
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export const ratingSchema = new Schema<IRating>(
  {
    userId: { type: String, required: true },
    rate: { type: Number, required: true },
    review: { type: String, required: false },
  },
  { _id: false },
);

export const menuItemSchema = new Schema<IMenuItem>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  price: { type: Number, required: true },
  avatar: {
    key: { type: String, required: false },
    url: { type: String, required: false },
  },
  sustainabilityScore: { type: Number, required: false },
  sustainabilityReason: { type: String, required: false },
  availableOnline: { type: Boolean, default: true },
  itemRating: { type: [ratingSchema], default: [] },
});

const restaurantSchema = new Schema<IRestaurant>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    workingHours: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    avatar: {
      key: { type: String, required: false },
    },
    description: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
    subscribed: { type: Boolean, default: false },
    subscriptionPeriod: { type: Date, required: false, default: Date.now() },
    stripeCustomerId: { type: String, required: false },
    menus: { type: [menuItemSchema], default: [] },
    restaurantRating: { type: [ratingSchema], default: [] },
  },
  { timestamps: true },
);

restaurantSchema.pre<IRestaurant>("save", function ():
  | Promise<void>
  | undefined {
  this.createdAt ??= new Date();
  if (!this.isModified("password")) {
    return;
  }
  return bcrypt.hash(this.password, 10).then((hashedPassword) => {
    this.password = hashedPassword;
  });
});

restaurantSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const RestaurantModel =
  models.Restaurant || model<IRestaurant>("Restaurant", restaurantSchema);
