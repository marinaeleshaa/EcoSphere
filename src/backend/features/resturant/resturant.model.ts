import mongoose, {model, Schema} from "mongoose";

export type IResturant = {
  _id?: string;
  name: string;
  email: string;
  passwordHash: string;
  location: string;
  rating: number;
  workingHours: string;
  phoneNumber: string;
  avatar?: string;
  description: string;
  createdAt?: Date;
}

export type IResturantDocument = IResturant & Document;

const resturantSchema = new Schema<IResturantDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    workingHours: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    avatar: { type: String, required: false },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const ResturantModel =
  mongoose.models.Resturant || model<IResturantDocument>("Resturant", resturantSchema);