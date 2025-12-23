import { Document, models, model, Schema, Types } from "mongoose";
import { IUser } from "../user/user.model";

export type EventType =
  | "environmental_seminar"
  | "community_cleanup"
  | "sustainable_brands_showcase"
  | "other";

export type EventUnpopulated = IEvent & { user: Types.ObjectId };
export type IsEventPopulated = Omit<IEvent, "user"> & { user: IUser };

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
  avatar?: {
    key: string;
    url?: string;
  };
  attenders?: string[];
  capacity: number;
  sections?: ISection[];
  eventDate: Date;
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
  type: EventType;
  isAccepted: boolean;
  isEventNew: boolean;
  user: Types.ObjectId | IUser;
}

export const sectionsSchema = new Schema<ISection>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false },
);

export const eventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true },
    locate: { type: String, required: true },
    ticketPrice: { type: Number, required: true },
    description: { type: String, required: true },
    avatar: {
      key: { type: String, required: true },
      url: { type: String, required: false },
    },
    attenders: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    capacity: { type: Number, required: true },
    sections: { type: [sectionsSchema], default: [] },
    createdAt: { type: Date, required: true, default: Date.now() },
    updatedAt: { type: Date, required: true, default: Date.now() },
    type: {
      type: String,
      enum: [
        "environmental_seminar",
        "community_cleanup",
        "sustainable_brands_showcase",
        "other",
      ],
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    eventDate: { type: Date, required: true },
    isAccepted: { type: Boolean, required: true, default: false },
    isEventNew: { type: Boolean, required: true, default: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { _id: true, timestamps: true },
);

export const EventModel = models.Event || model<IEvent>("Event", eventSchema);
