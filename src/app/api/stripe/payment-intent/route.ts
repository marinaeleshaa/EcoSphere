import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import { PaymentService } from "@/backend/services/payment.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, metaData } = body;

    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    const paymentService = rootContainer.resolve(PaymentService);
    const paymentIntent = await paymentService.createPaymentIntent(
      amount,
      currency,
      metaData
    );

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error in payment intent route:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to create payment intent";
    const status = errorMessage.includes("Amount is too small") ? 400 : 500;

    return NextResponse.json({ error: errorMessage }, { status: status });
  }
}
