import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import { PaymentService } from "@/backend/services/payment.service";
import { getPriceIdForPlan } from "@/backend/config/subscription.config";

/**
 * POST /api/subscriptions/checkout
 * Body: { plan: string }
 * Returns: { url }
 * The frontend MUST only send a logical plan key — the backend maps it to a price id.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, customerEmail, userId, role } = body;

    if (!plan)
      return NextResponse.json({ error: "plan is required" }, { status: 400 });

    // Map plan key to Stripe price id. This prevents frontend from sending raw price details.
    const priceId = getPriceIdForPlan(plan);

    const paymentService = rootContainer.resolve(PaymentService);

    // Determine origin / domain for redirect urls
    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    const domain = origin.replace(/\/$/, "");

    const session = await paymentService.createSubscriptionCheckoutSession({
      priceId,
      successUrl: `${domain}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${domain}/subscription/canceled`,
      customerEmail,
      metadata: (() => {
        const md: Record<string, string> = {};
        if (userId) md.userId = userId;
        if (role) md.role = role;
        return Object.keys(md).length ? md : undefined;
      })(),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating subscription checkout session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "failed" },
      { status: 500 },
    );
  }
}
