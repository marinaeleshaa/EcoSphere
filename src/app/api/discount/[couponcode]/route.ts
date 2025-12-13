import { rootContainer } from "@/backend/config/container";
import { CouponController } from "@/backend/features/discountCoupon/coupon.controller";
import { requireAuth } from "@/backend/utils/authHelper";
import { notFound, ok, serverError } from "@/types/api-helpers";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
	const { nextUrl } = req;
	const user = await requireAuth();
	const code = nextUrl.pathname.split("/")[3];
	// const [code, userId] = data.split("-"); // for testing using post man
	try {
		const response = await rootContainer
			.resolve(CouponController)
			.useCoupon(code, user!.id);
		if (!response) return notFound();
		return ok(response);
	} catch (error) {
		console.error(error);
		return serverError(error!.message);
	}
};
