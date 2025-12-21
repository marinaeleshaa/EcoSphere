import { Schema, Document, model, models, Types } from "mongoose";

export interface ISubscription extends Document {
  userId: Types.ObjectId | string;
  stripeSubscriptionId: string;
  stripeCustomerId?: string;
  status: string;
  priceId?: string;
  currentPeriodEnd?: Date;
  raw?: Record<string, unknown>;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    stripeSubscriptionId: { type: String, required: true, unique: true },
    stripeCustomerId: { type: String, required: false },
    status: { type: String, required: true },
    priceId: { type: String, required: false },
    currentPeriodEnd: { type: Date, required: false },
    raw: { type: Schema.Types.Mixed, required: false },
  },
  { timestamps: true },
);

// subscriptionSchema.index({ stripeSubscriptionId: 1 }, { unique: true });

export const SubscriptionModel =
  models.Subscription ||
  model<ISubscription>("Subscription", subscriptionSchema);
