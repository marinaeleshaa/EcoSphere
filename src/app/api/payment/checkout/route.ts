import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/backend/services/payment.service";
import { rootContainer } from "@/backend/config/container";

export const POST = async (req: NextRequest) => {
  const { userId, email, cartItems } = await req.json();

  // Determine origin / domain for redirect urls
  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";
  const domain = origin.replace(/\/$/, "");
  const session = await rootContainer.resolve(PaymentService).createSession({
    successUrl: `${domain}/payment/success`,
    cancelUrl: `${domain}/payment/failed`,
    userId,
    userEmail: email,
    cartItems,
  });

  return NextResponse.json({ url: session.url });
};
