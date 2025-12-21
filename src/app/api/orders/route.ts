import { rootContainer } from "@/backend/config/container";
import { OrderController } from "@/backend/features/orders/order.controller";
import { requireAuth } from "@/backend/utils/authHelper";
import { ok, serverError } from "@/types/api-helpers";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
	const body = await req.json();
	try {
		const user = await requireAuth();
		await requireAuth();
		const order = await rootContainer
			.resolve(OrderController)
			.createOrder({ items: body, userId: user.id, paymentMethod: "stripe" });
		return ok(order);
	} catch (error) {
		console.error(error);
		serverError();
	}
};
