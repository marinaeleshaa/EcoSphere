import { injectable } from "tsyringe";
import { stripe } from "../config/stripe.config";
import Stripe from "stripe";

@injectable()
export class PaymentService {
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
}
