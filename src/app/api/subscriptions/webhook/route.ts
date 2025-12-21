import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/backend/config/stripe.config";
import { rootContainer } from "@/backend/config/container";
import { badRequest } from "@/types/api-helpers";
import { WebhookEventService } from "@/backend/features/webhookEvent/webhook.event.service";

// Using raw body for signature verification
// export const runtime = "edge"; // edge runtime provides raw body via arrayBuffer

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    console.error("Stripe webhook missing signature or secret not configured");
    return badRequest("missing signature or secret");
  }

  try {
    const buf = await request.arrayBuffer();
    const payload = Buffer.from(buf);
    const event = stripe.webhooks.constructEvent(payload, sig, secret);

    const webhookService = rootContainer.resolve(WebhookEventService);
    const response = await webhookService.saveNewhookEvent(event)
    
    return NextResponse.json(response);
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
