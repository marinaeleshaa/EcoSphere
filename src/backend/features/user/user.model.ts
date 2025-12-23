import { Document, model, models, Schema, Types } from "mongoose";
import bcrypt from "bcrypt";

export type UserRole = "customer" | "organizer" | "admin" | "recycleMan";

export type Gender = "male" | "female";

export interface ICart extends Document {
  restaurantId: Types.ObjectId | string;
  productId: string;
  quantity: number;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
  birthDate?: string;
  gender?: Gender;
  points: number;
  role: UserRole;
  subscribed?: boolean;
  stripeCustomerId?: string;
  accountProvider?: string;
  subscriptionPeriod?: Date;
  address?: string;
  avatar?: {
    key: string;
    url?: string;
  };
  favoritesIds?: string[];
  cart?: ICart[];
  paymentHistory?: string[];
  events?: string[];
  resetCode?: {
    code: string;
    validTo: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const cartSchema = new Schema<ICart>(
  {
    restaurantId: {
      type: Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false },
);

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: false, select: false },
    phoneNumber: { type: String, required: false },
    address: { type: String, required: false },
    avatar: {
      key: { type: String, required: false },
    },
    birthDate: { type: String, required: false },
    gender: { type: String, enum: ["male", "female"], required: false },
    subscribed: { type: Boolean, default: false },
    stripeCustomerId: { type: String, required: false },
    subscriptionPeriod: { type: Date, required: false, default: Date.now() },
    points: { type: Number, default: 1000 },
    accountProvider: { type: String, required: false },
    role: {
      type: String,
      enum: ["customer", "organizer", "admin", "recycleMan"],
      default: "customer",
    },
    favoritesIds: { type: [String], default: [] },
    cart: { type: [cartSchema], default: [] },
    paymentHistory: { type: [String], default: [] },
    events: { type: [Schema.Types.ObjectId], ref: "Event", default: [] },
    resetCode: {
      code: { type: String, required: false },
      validTo: { type: String, required: false },
    },
  },
  { timestamps: true },
);

userSchema.pre<IUser>("save", function (): Promise<void> | undefined {
  this.createdAt ??= new Date();
  if (!this.isModified("password")) return;

  return bcrypt.hash(this.password, 10).then((hashedPassword) => {
    this.password = hashedPassword;
  });
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ updatedAt: -1 });
userSchema.index({ subscriptionPeriod: -1 });

export const UserModel = models.User || model<IUser>("User", userSchema);
