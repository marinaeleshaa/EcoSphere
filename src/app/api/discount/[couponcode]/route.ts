import { rootContainer } from "@/backend/config/container";
import { CouponController } from "@/backend/features/discountCoupon/coupon.controller";
import { notFound, ok, serverError } from "@/types/api-helpers";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const { nextUrl } = req;
  const code = nextUrl.pathname.split("/")[3];
  try {
    const response = await rootContainer
      .resolve(CouponController)
      .useCoupon(code);
    if (!response) return notFound();
    return ok(response);
  } catch (error) {
    console.error(error);
    return serverError();
  }
};
