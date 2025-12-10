import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import { PaymentService } from "@/backend/services/payment.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency } = body;

    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    const paymentService = rootContainer.resolve(PaymentService);
    const paymentIntent = await paymentService.createPaymentIntent(
      amount,
      currency
    );

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error in payment intent route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create payment intent",
      },
      { status: 500 }
    );
  }
}
