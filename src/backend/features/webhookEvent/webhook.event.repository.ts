import { injectable } from "tsyringe";
import { IWebhookEvent, WebhookEventModel } from "./webhook.event.model";

export interface IWebhookEventRepository {
  getByStripeEventId(stripeEventId: string): Promise<IWebhookEvent>;
  saveWebhook(stripeEventId: string): Promise<void>;
}

@injectable()
export class WebhookEventRepository implements IWebhookEventRepository {
  async getByStripeEventId(stripeEventId: string): Promise<IWebhookEvent> {
    const existing = await WebhookEventModel.findOne({
      stripeEventId,
    })
      .select("_id")
      .lean<IWebhookEvent>()
      .exec();
    return existing!;
  }

  async saveWebhook(stripeEventId: string): Promise<void> {
    // Atomically create the sentinel only if it does not already exist.
    // Using findOneAndUpdate with $setOnInsert avoids race conditions / duplicate-key errors
    // when Stripe sends the same event concurrently.
    await WebhookEventModel.findOneAndUpdate(
      { stripeEventId },
      { $setOnInsert: { stripeEventId } },
      { upsert: true, new: false },
    ).exec();
  }
}
