import { inject, injectable } from "tsyringe";
import { type ICouponService } from "./coupon.service";
import { ICoupon } from "./coupon.model";

@injectable()
export class CouponController {
	constructor(
		@inject("CouponService") private readonly couponService: ICouponService
	) {}

	async findCoupon(code: string) {
		if (!code) return;
		const response = await this.couponService.findCouponByCode(code);
		if (!response) return;
		return response;
	}

	async useCoupon(code: string, userId: string) {
		if (!code) return;
		const response = await this.couponService.useCoupon(code, userId);
		return response;
	}

	async createCoupon(data: ICoupon) {
		if (!data) return;
		const response = this.couponService.createCoupon(data);
		return response;
	}

	async deleteCoupon(code: string) {
		if (!code) return;
		const response = await this.couponService.deleteCoupon(code);
		return response;
	}
}
