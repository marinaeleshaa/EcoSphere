import { DBInstance } from "@/backend/config/dbConnect";
import { injectable } from "tsyringe";
import { CouponModel, ICoupon } from "./coupon.model";

export interface ICouponRepository {
	findByCode(code: string): Promise<ICoupon>;
	updateCoupon(code: string, updateData: Partial<ICoupon>): Promise<ICoupon>;
	createCoupon(couponData: ICoupon): Promise<ICoupon>;
	removeCoupon(code: string): Promise<ICoupon>;
}

@injectable()
export class CouponRepository implements ICouponRepository {
	//
	async findByCode(code: string): Promise<ICoupon> {
		await DBInstance.getConnection();
		const result = await CouponModel.findOne({ code }).lean<ICoupon>().exec();
		return result!;
	}

	async updateCoupon(
		code: string,
		updateData: Partial<ICoupon>
	): Promise<ICoupon> {
		await DBInstance.getConnection();
		const result = await CouponModel.findOneAndUpdate({ code }, updateData, {
			new: true,
		})
			.select("code rate validTo")
			.lean<ICoupon>()
			.exec();
		return result!;
	}

	async createCoupon(couponData: ICoupon): Promise<ICoupon> {
		await DBInstance.getConnection();
		return await CouponModel.create(couponData);
	}

	async removeCoupon(code: string): Promise<ICoupon> {
		await DBInstance.getConnection();
		const result = await CouponModel.findOneAndDelete({ code })
			.lean<ICoupon>()
			.exec();
		return result!;
	}
}
