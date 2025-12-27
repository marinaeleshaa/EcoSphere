import { Document, model, models, Schema } from "mongoose";

export interface IChatFeedback extends Document {
  messageId: string;
  userId?: string;
  userMessage: string;
  aiResponse: string;
  rating: "positive" | "negative";
  context?: {
    type: string;
    id?: string;
  };
  timestamp: Date;
}

const chatFeedbackSchema = new Schema<IChatFeedback>({
  messageId: { type: String, required: true, unique: true },
  userId: { type: String, required: false },
  userMessage: { type: String, required: true },
  aiResponse: { type: String, required: true },
  rating: { type: String, enum: ["positive", "negative"], required: true },
  context: {
    type: {
      type: String,
      required: false,
    },
    id: {
      type: String,
      required: false,
    },
  },
  timestamp: { type: Date, default: Date.now },
});

chatFeedbackSchema.index({ userId: 1, timestamp: -1 });
chatFeedbackSchema.index({ rating: 1 });
chatFeedbackSchema.index({ timestamp: -1 });

export const ChatFeedbackModel =
  models.ChatFeedback ||
  model<IChatFeedback>("ChatFeedback", chatFeedbackSchema);
