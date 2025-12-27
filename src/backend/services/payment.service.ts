import { inject, injectable } from "tsyringe";
import { stripe } from "../config/stripe.config";
import Stripe from "stripe";
import { IProductCart } from "@/types/ProductType";
import { OrderService } from "../features/orders/order.service";

@injectable()
export class PaymentService {
  constructor(
    @inject("OrderService") private readonly orderService: OrderService
  ) {}
  /**
   * Creates a Stripe PaymentIntent.
   * @param amount Amount in cents (e.g., 2000 for $20.00)
   * @param currency Currency code (default: 'usd')
   * @param metadata Optional metadata to attach to the payment intent
   */
  async createPaymentIntent(
    amount: number,
    currency: string = "usd",
    metadata: Record<string, string> = {}
  ): Promise<Stripe.PaymentIntent> {
    // Stripe requires a minimum equivalent to $0.50 USD.
    // EGP ~0.50 USD is roughly 25-30 EGP. We'll enforce 30 EGP to be safe.
    if (currency.toLowerCase() === "egp" && amount < 3000) {
      throw new Error(
        "Amount is too small. The minimum payment for EGP is 30.00 EGP due to payment processor requirements."
      );
    }
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Ensure integer
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw error;
    }
  }

  /**
   * Create a Stripe Checkout Session for subscriptions.
   * The frontend will POST a planKey (e.g. "pro_monthly") and the backend
   * maps that to a Stripe Price ID (so the frontend never sends raw prices).
   * Uses mode: 'subscription' (not PaymentIntent).
   */
  async createSubscriptionCheckoutSession(opts: {
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    customerEmail?: string; // optional, Stripe can create a customer record
    metadata?: Record<string, string>;
  }) {
    try {
      // If metadata is not provided, warn — without metadata the webhook flow cannot
      // map the Stripe customer/subscription back to a user or restaurant in our DB.
      if (!opts.metadata || Object.keys(opts.metadata).length === 0) {
        console.warn(
          "Creating Stripe Checkout session without metadata; webhooks will not be able to map customer to user/restaurant."
        );
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: opts.priceId, quantity: 1 }],
        success_url: opts.successUrl,
        cancel_url: opts.cancelUrl,
        customer_email: opts.customerEmail,
        // Attach metadata to the Checkout Session object
        metadata: opts.metadata,
        // Also attach the same metadata to the subscription resource that Checkout
        // will create. This ensures that events like customer.subscription.created
        // and invoice.payment_succeeded contain the metadata and we can map them
        // back to our local user or restaurant.
        subscription_data: {
          metadata: opts.metadata,
        },
        // Allow promotion codes and automatic tax behavior if desired
        allow_promotion_codes: true,
      });

      return session;
    } catch (error) {
      console.error("Error creating subscription checkout session:", error);
      throw error;
    }
  }

  /**
   * Create a Stripe Customer Portal session so users can manage subscriptions.
   * Backend must provide the customer id and a return url.
   */
  async createCustomerPortalSession(customerId: string, returnUrl: string) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
      return session;
    } catch (error) {
      console.error("Error creating customer portal session:", error);
      throw error;
    }
  }

  async createSession({
    successUrl,
    cancelUrl,
    cartItems,
    userEmail,
    userId,
  }: {
    successUrl: string;
    cancelUrl: string;
    cartItems: IProductCart[];
    userEmail: string;
    userId: string;
  }) {
    const order = await this.orderService.createOrder(userId, {
      userId,
      items: cartItems.map((item) => ({ ...item, productId: item.id })),
      paymentMethod: "stripe",
    });

    // Prepare items data for webhook to decrease stock on payment success
    const itemsForStock = cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      restaurantId: item.restaurantId,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: cartItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "egp",
          unit_amount: item.productPrice * 100, // cents
          product_data: {
            name: item.productName,
            // description: item.productDescription, // encomment it only if the products have a description
            images: [item.productImg],
          },
        },
      })),
      success_url: `${successUrl}?orderId=${order._id}`, // `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cancelUrl}?orderId=${order._id}`, // `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      customer_email: userEmail,
      metadata: {
        userId,
        orderId: `${order._id}`,
        items: JSON.stringify(itemsForStock), // Items for stock decrease on payment success
      },
    });
    return session;
  }

  async createEventSession({
    successUrl,
    cancelUrl,
    eventItem,
    userEmail,
    userId,
  }: {
    successUrl: string;
    cancelUrl: string;
    eventItem: {
      id: string;
      name: string;
      image: string;
      quantity: number;
    };
    userEmail: string;
    userId: string;
  }) {
    const order = await this.orderService.createOrder(userId, {
      userId,
      items: [
        {
          eventId: eventItem.id,
          quantity: eventItem.quantity,
        },
      ] as any,
      paymentMethod: "stripe",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: eventItem.quantity,
          price_data: {
            currency: "egp",
            unit_amount: Math.round(
              (order.orderPrice * 100) / eventItem.quantity
            ), // Calculate unit price from total order price
            product_data: {
              name: eventItem.name,
              images: [eventItem.image],
            },
          },
        },
      ],
      success_url: `${successUrl}?orderId=${order._id}`,
      cancel_url: `${cancelUrl}?orderId=${order._id}`,
      customer_email: userEmail,
      metadata: {
        userId,
        orderId: `${order._id}`,
        eventId: eventItem.id,
        type: "event_ticket",
      },
    });
    return session;
  }
}
