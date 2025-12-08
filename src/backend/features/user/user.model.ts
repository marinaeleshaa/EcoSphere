import mongoose, { Document, model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export type UserRole = "customer" | "organizer" | "admin";

export type Gender = "male" | "female";

export type EventType =
  | "Music Festival"
  | "Conference"
  | "Workshop"
  | "Sporting Event"
  | "Exhibition"
  | "Private Party"
  | "Other";

export interface ISection extends Document {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

export interface IEvent extends Document {
  name: string;
  locate: string;
  ticketPrice: number;
  description: string;
  avatar?: string;
  attenders: string[];
  capacity: number;
  sections?: ISection[];
  eventDate: Date;
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
  type: EventType;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber?: string;
  birthDate?: string;
  gender?: Gender;
  points: number;
  role: UserRole;
  subscribed?: boolean;
  accountProvider?: string;
  subscriptionPeriod?: Date;
  address?: string;
  avatar?: {
    key: string;
    url?: string;
  };
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
    description: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false }
);

export const eventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true },
    locate: { type: String, required: true },
    ticketPrice: { type: Number, required: true },
    avatar: { type: String, required: true },
    attenders: { type: [String], default: [] },
    capacity: { type: Number, required: true },
    sections: { type: [sectionsSchema], default: [] },
    createdAt: { type: Date, required: true, default: Date.now() },
    updatedAt: { type: Date, required: true, default: Date.now() },
    type: {
      type: String,
      enum: [
        "Music Festival",
        "Conference",
        "Workshop",
        "Sporting Event",
        "Exhibition",
        "Private Party",
        "Other",
      ],
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    eventDate: { type: Date, required: true },
  },
  { _id: true, timestamps: true }
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
    subscriptionPeriod: { type: Date, required: false, default: Date.now() },
    points: { type: Number, default: 1000 },
    accountProvider: { type: String, required: false },
    role: {
      type: String,
      enum: ["customer", "organizer", "admin"],
      default: "customer",
    },
    favoritesIds: { type: [String], default: [] },
    cart: { type: [String], default: [] },
    paymentHistory: { type: [String], default: [] },
    events: { type: [eventSchema], default: [] },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", function (): Promise<void> | undefined {
  this.createdAt ??= new Date();
  if (!this.isModified("password")) return;
  
  return bcrypt.hash(this.password, 10).then((hashedPassword) => {
    this.password = hashedPassword;
  });
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const UserModel =
  mongoose.models.User || model<IUser>("User", userSchema);
