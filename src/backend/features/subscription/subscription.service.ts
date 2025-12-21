import Stripe from "stripe";
import { inject, injectable } from "tsyringe";
import type { ISubscriptionRepository } from "./subscription.repository";
import type { IUserRepository } from "../user/user.repository";
import type { IRestaurantRepository } from "../restaurant/restaurant.repository";

export type Subscription = {
  stripeSubscriptionId: string;
  stripeCustomerId?: string;
  status: string;
  priceId?: string;
  currentPeriodEnd?: Date;
  // Use a looser type for `raw` to avoid tight coupling to a specific Stripe type
  // shape across different SDK versions; it can still be set to a Stripe.Subscription.
  raw: Record<string, unknown> | Stripe.Subscription;
};

@injectable()
export class SubscriptionService {
  constructor(
    @inject("SubscriptionRepository")
    private readonly subRepo: ISubscriptionRepository,
    @inject("IUserRepository") private readonly userRepo: IUserRepository,
    @inject("IRestaurantRepository")
    private readonly restaurantRepo: IRestaurantRepository,
  ) {}
  /**
   * Create or update subscription record from a Stripe subscription object.
   * This will also update the user's `subscribed` flag and `subscriptionPeriod`.
   */
  async upsertFromStripeSubscription(sub: Stripe.Subscription) {
    // Derive fields from Stripe subscription object
    const stripeSubscriptionId = sub.id;
    const stripeCustomerId =
      typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
    const status = sub.status;
    const priceId = sub.items?.data?.[0]?.price?.id;
    // Use the subscription-level `current_period_end` (seconds).
    // Cast to a safe record and handle both snake_case and camelCase shapes that
    // may appear depending on Stripe SDK/version or runtime object shape.
    // const rawSub = sub as unknown as Record<string, unknown>;
    const rawCurrentPeriodEnd = sub.items.data[0].current_period_end;
    // one month from now
    const currentPeriodEnd = new Date(rawCurrentPeriodEnd * 1000);

    // Upsert subscription record (idempotent)
    const updated = await this.subRepo.updateSubscription({
      stripeSubscriptionId,
      stripeCustomerId,
      status,
      priceId,
      currentPeriodEnd,
      raw: sub,
    });

    // If we can find an account by stripeCustomerId then update the corresponding record.
    // First try Users (organizers / recycleMen). If no user, try Restaurants (shops).
    if (stripeCustomerId) {
      await this.updateAssociatedAccount(
        stripeCustomerId,
        status,
        currentPeriodEnd,
      );
    }
    return updated;
  }

  /**
   * Updates the associated User or Restaurant record based on the Stripe Customer ID.
   */
  private async updateAssociatedAccount(
    stripeCustomerId: string,
    status: string,
    currentPeriodEnd: Date,
  ) {
    const isActive = ["active", "trialing", "past_due"].includes(status);

    // Try to update a User record first
    const user = await this.userRepo.getUserByStripeId(stripeCustomerId);
    if (user) {
      user.subscribed = isActive;
      if (currentPeriodEnd)
        user.subscriptionPeriod = this.calculateData(
          user.subscriptionPeriod!,
          currentPeriodEnd,
        );
      await user.save();
      return;
    }

    // If no user found, try restaurant/shop
    try {
      const restaurant =
        await this.restaurantRepo.getRestaurantByStripeId(stripeCustomerId);
      if (restaurant) {
        restaurant.subscribed = isActive;
        if (currentPeriodEnd)
          restaurant.subscriptionPeriod = this.calculateData(
            restaurant.subscriptionPeriod!,
            currentPeriodEnd,
          );
        await restaurant.save();
      }
    } catch (err) {
      // Log and continue; do not fail the webhook processing for missing shop mapping
      console.error(
        "Failed to update restaurant subscription from Stripe event:",
        err,
      );
    }
  }
  /**
   * Handle deletion/cancellation of subscriptions from Stripe.
   */
  async handleDeletedSubscription(sub: Stripe.Subscription) {
    const stripeSubscriptionId = sub.id;
    await this.subRepo.deleteSubscription(
      stripeSubscriptionId,
      sub.status,
      sub,
    );

    const stripeCustomerId =
      typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
    if (stripeCustomerId) {
      const user = await this.userRepo.getUserByStripeId(stripeCustomerId);
      if (user) {
        user.subscribed = false;
        user.subscriptionPeriod = undefined;
        await user.save();
      }
    }
  }

  private calculateData(entityData: Date, stripeDate: Date): Date {
    const now = new Date();

    let finalEnd: Date;

    if (!entityData || entityData <= now) {
      // expired or first subscription
      finalEnd = stripeDate;
    } else {
      // active subscription → extend
      finalEnd = new Date(entityData.getTime() + 2592000000); // 30 days
    }
    return finalEnd;
  }
}
