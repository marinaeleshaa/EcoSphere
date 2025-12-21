import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/backend/config/stripe.config";
import Stripe from "stripe";
import { rootContainer } from "@/backend/config/container";
import { OrderController } from "@/backend/features/orders/order.controller";

export const POST = async (req: NextRequest) => {
	const body = await req.text();
	const sig = req.headers.get("stripe-signature");

	if (!sig) {
		return new Response("Missing signature", { status: 400 });
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			sig,
			process.env.STRIPE_WEBHOOK_SECRET!
		);
	} catch (err) {
		console.error("Webhook signature verification failed:", err);
		return new Response("Webhook Error", { status: 400 });
	}
	// 🔁 Delegate business logic
	await rootContainer.resolve(OrderController).handleStripeEvent(event);

	return NextResponse.json({ received: true });
};
