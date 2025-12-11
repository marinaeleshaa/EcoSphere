import { rootContainer } from "@/backend/config/container";
import { CouponController } from "@/backend/features/discountCoupon/coupon.controller";
import { badRequest, ok, serverError } from "@/types/api-helpers";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
	const body = await req.json();
	try {
		const result = await rootContainer
			.resolve(CouponController)
			.createCoupon(body);
		if (!result) return badRequest();
		return ok(result);
	} catch (error) {
		console.error(error);
		serverError();
	}
};
