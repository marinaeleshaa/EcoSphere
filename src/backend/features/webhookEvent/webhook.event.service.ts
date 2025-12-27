import { inject, injectable } from "tsyringe";
import type { IWebhookEventRepository } from "./webhook.event.repository";
import { SubscriptionService } from "../subscription/subscription.service";
import { stripe } from "@/backend/config/stripe.config";
import type { IUserService } from "../user/user.service";
import type { IRestaurantService } from "../restaurant/restaurant.service";
import type { IRestaurant } from "../restaurant/restaurant.model";
import Stripe from "stripe";

@injectable()
export class WebhookEventService {
	constructor(
		@inject("WebhookRepository")
		private readonly webhookRepo: IWebhookEventRepository,
		@inject("SubscriptionService")
		private readonly subscriptionService: SubscriptionService,
		@inject("IUserService") private readonly userService: IUserService,
		@inject("IRestaurantService")
		private readonly restaurantService: IRestaurantService
	) {}

	async saveNewhookEvent(event: Stripe.Event) {
		// Idempotency: do nothing if we've already processed this event
		const existing = await this.webhookRepo.getByStripeEventId(event.id);

		if (existing) {
			return { received: true };
		}

		try {
			await this.handleEventStrategy(event);

			// Record we have successfully processed this event (idempotency guard)
			await this.webhookRepo.saveWebhook(event.id);

			return { received: true };
		} catch (err) {
			console.error("Error processing webhook event:", err);
			// Do not mark event as processed so Stripe will retry.
			throw err;
		}
	}

	private async handleEventStrategy(event: Stripe.Event) {
		switch (event.type) {
			case "customer.subscription.created":
				await this.handleSubscriptionCreated(event);
				break;
			case "checkout.session.completed":
				await this.handleCheckoutSessionCompleted(event);
				break;
			case "invoice.payment_succeeded":
				await this.handleInvoicePaymentSucceeded(event);
				break;
			case "customer.subscription.deleted":
				await this.handleSubscriptionDeleted(event);
				break;
			default:
				console.warn("Unhandled event type:", event.type);
		}
	}

	private async handleSubscriptionCreated(event: Stripe.Event) {
		const payloadObj = event.data.object;
		const subscription = payloadObj as Stripe.Subscription;
		const subMetadata = (
			subscription as unknown as { metadata?: Record<string, string> }
		).metadata;

		if (subscription && subMetadata?.userId) {
			const stripeCustomer =
				typeof subscription.customer === "string"
					? subscription.customer
					: (subscription.customer as Stripe.Customer)?.id;

			if (stripeCustomer) {
				await this.attachStripeCustomerId(
					subMetadata.userId,
					subMetadata.role,
					stripeCustomer,
					"subscription.metadata"
				);
			}
		} else {
			console.warn(
				"customer.subscription.created received without subscription.metadata.userId — cannot auto-map customer to user/restaurant. Subscription id:",
				subscription?.id
			);
		}

		await this.subscriptionService.upsertFromStripeSubscription(subscription);
	}

	private async handleCheckoutSessionCompleted(event: Stripe.Event) {
		const session = event.data.object as {
			customer?: string;
			metadata?: Record<string, string>;
			id?: string;
		};

		if (session.customer && session.metadata?.userId) {
			await this.attachStripeCustomerId(
				session.metadata.userId,
				session.metadata.role,
				session.customer,
				"checkout.session.completed"
			);
		} else {
			console.warn(
				"checkout.session.completed: missing session.metadata.userId. Session may not have been created with metadata — ID:",
				session.id
			);
		}
	}

	private async handleInvoicePaymentSucceeded(event: Stripe.Event) {
		const invoice = event.data.object as {
			subscription?: string | { id?: string };
		};
		const subId =
			typeof invoice.subscription === "string"
				? invoice.subscription
				: invoice.subscription?.id;

		if (subId) {
			const subscription = await stripe.subscriptions.retrieve(subId);
			const subMeta = (
				subscription as unknown as { metadata?: Record<string, string> }
			).metadata;

			if (subMeta?.userId) {
				const stripeCustomer =
					typeof subscription.customer === "string"
						? subscription.customer
						: (subscription.customer as Stripe.Customer)?.id;

				if (stripeCustomer) {
					await this.attachStripeCustomerId(
						subMeta.userId,
						subMeta.role,
						stripeCustomer,
						"subscription.metadata (invoice)"
					);
				}
			} else {
				console.warn(
					"invoice.payment_succeeded: subscription has no metadata.userId. subId:",
					subId
				);
			}

			await this.subscriptionService.upsertFromStripeSubscription(
				subscription as Stripe.Subscription
			);
		}
	}

	private async handleSubscriptionDeleted(event: Stripe.Event) {
		await this.subscriptionService.handleDeletedSubscription(
			event.data.object as Stripe.Subscription
		);
	}

	private async attachStripeCustomerId(
		userId: string,
		role: string | undefined,
		stripeCustomer: string,
		source: string
	) {
		if (role === "shop" || role === "restaurant") {
			try {
				await this.restaurantService.updateById(userId, {
					stripeCustomerId: stripeCustomer,
				} as Partial<IRestaurant>);
				
			} catch (err) {
				console.error(
					`Failed to attach stripeCustomerId to restaurant (from ${source}):`,
					err
				);
			}
		} else {
			try {
				await this.userService.updateSubscription(userId, {
					stripeCustomerId: stripeCustomer,
				});
				
			} catch (err) {
				console.error(
					`Failed to attach stripeCustomerId to user (from ${source}):`,
					err
				);
			}
		}
	}
}
