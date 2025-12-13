import { injectable, inject } from "tsyringe";
import { ICoupon } from "./coupon.model";
import type { ICouponRepository } from "./coupon.repository";

export interface ICouponService {
	findCouponByCode(code: string): Promise<ICoupon>;
	useCoupon(code: string, userId: string): Promise<ICoupon>;
	createCoupon(couponData: ICoupon): Promise<ICoupon>;
	deleteCoupon(code: string): Promise<ICoupon>;
}

@injectable()
export class CouponService implements ICouponService {
	constructor(
		@inject("CouponRepository")
		private readonly couponRepository: ICouponRepository
	) {}

	async findCouponByCode(code: string): Promise<ICoupon> {
		const coupon = await this.couponRepository.findByCode(code);
		if (!coupon) {
			throw new Error(`Coupon with code ${code} not found`);
		}
		return coupon;
	}

	async useCoupon(code: string, userId: string): Promise<ICoupon> {
		const coupon = await this.findCouponByCode(code);
		if (coupon.numberOfUse >= coupon.maxNumberOfUse) 
			throw new Error(`Coupon ${code} has reached its usage limit`);

		if (coupon.validTo <= new Date()) 
			throw new Error(`Coupon ${code} outdated`);

		if (coupon.source === "redeem" && `${coupon.createdBy}` !== userId)
			throw new Error(`Coupon ${code} not meant for this user`);

		++coupon.numberOfUse;
		return await this.couponRepository.updateCoupon(code, coupon);
	}

	async createCoupon(couponData: ICoupon): Promise<ICoupon> {
		return await this.couponRepository.createCoupon(couponData);
	}

	async deleteCoupon(code: string): Promise<ICoupon> {
		return await this.couponRepository.removeCoupon(code);
	}
}
