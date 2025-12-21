import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import { PaymentService } from "@/backend/services/payment.service";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { customerId } = body;

		if (!customerId)
			return NextResponse.json(
				{ error: "customerId required" },
				{ status: 400 }
			);

		const paymentService = rootContainer.resolve(PaymentService);
		const origin =
			request.headers.get("origin") ||
			process.env.NEXT_PUBLIC_APP_URL ||
			"http://localhost:3000";

		const session = await paymentService.createCustomerPortalSession(
			customerId,
			origin
		);

		return NextResponse.json({ url: session.url });
	} catch (error) {
		console.error("Error creating portal session:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "failed" },
			{ status: 500 }
		);
	}
}
