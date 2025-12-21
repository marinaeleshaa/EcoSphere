import { injectable } from "tsyringe";
import { ISubscription, SubscriptionModel } from "./subscription.model";
import { Subscription } from "./subscription.service";
import Stripe from "stripe";

export interface ISubscriptionRepository {
  updateSubscription(data: Subscription): Promise<ISubscription>;
  deleteSubscription(
    stripeSubscriptionId: string,
    status: string,
    rawSub: Stripe.Subscription,
  ): Promise<void>;
}

@injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  async updateSubscription(data: Subscription): Promise<ISubscription> {
    // const sub = await SubscriptionModel.findOne({ stripeSubscriptionId: data.stripeSubscriptionId }).exec();
    
    // const now = new Date();
    // // const savedEnd = sub.subscriptionPeriod; // from DB
    
    // let finalEnd: Date;
    
    // if (!sub.subscriptionPeriod || savedEnd <= now) {
    //   // expired or first subscription
    //   finalEnd = stripeEnd;
    // } else {
    //   // active subscription → extend
    //   finalEnd = new Date(savedEnd.getTime() + 30 * 24 * 60 * 60 * 1000);
    // }
    
    const updated = await SubscriptionModel.findOneAndUpdate(
      { stripeSubscriptionId: data.stripeSubscriptionId },
      {
        stripeSubscriptionId: data.stripeSubscriptionId,
        stripeCustomerId: data.stripeCustomerId,
        status: data.status,
        priceId: data.priceId,
        currentPeriodEnd: data.currentPeriodEnd,
        raw: data.raw as unknown,
      },
      { upsert: true, new: true },
    ).exec();
    return updated;
  }

  async deleteSubscription(
    stripeSubscriptionId: string,
    status: string,
    rawSub: Stripe.Subscription,
  ): Promise<void> {
    await SubscriptionModel.findOneAndUpdate(
      { stripeSubscriptionId },
      { status: status, raw: rawSub },
    )
      .lean()
      .exec();
  }
}
