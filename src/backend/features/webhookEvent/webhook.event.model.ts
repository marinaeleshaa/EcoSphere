import { Schema, Document, model, models } from "mongoose";

export interface IWebhookEvent extends Document {
  stripeEventId: string;
}

const webhookEventSchema = new Schema<IWebhookEvent>(
  {
    stripeEventId: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export const WebhookEventModel =
  models.WebhookEvent ||
  model<IWebhookEvent>("WebhookEvent", webhookEventSchema);
