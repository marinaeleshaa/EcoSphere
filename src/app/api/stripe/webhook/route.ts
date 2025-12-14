import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/backend/config/stripe.config";
import Stripe from "stripe";
import { rootContainer } from "@/backend/config/container";
import { OrderController } from "@/backend/features/orders/order.controller";

export const POST = async (req: NextRequest) => {
  const body = await req.text();
  const sig = headers().get("stripe-signature");

  if (!sig) {
    return new Response("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Webhook Error", { status: 400 });
  }

  // // 🔥 Handle events
  // switch (event.type) {
  //   case "payment_intent.succeeded":
  //     await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
  //     break;

  //   case "payment_intent.payment_failed":
  //     await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
  //     break;
  // }
  // 🔁 Delegate business logic
  const orderService = rootContainer.resolve(OrderController);
  await orderService.handleStripeEvent(event);

  return new Response("OK", { status: 200 });
};
