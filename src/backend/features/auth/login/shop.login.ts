import { inject, injectable } from "tsyringe";
import { ILoginStrategy } from "./login.service";
import { LoginRequestDTO, LoginResponseDTO, PublicUserProfile } from "../dto/user.dto";
import type { IAuthRepository } from "../auth.repository";
import { signJwt } from "@/backend/utils/helpers";

@injectable()
class ShopLoginStrategy implements ILoginStrategy {
	constructor(
		@inject("IAuthRepository") private readonly authRepo: IAuthRepository
	) {}
	async login(date: LoginRequestDTO): Promise<LoginResponseDTO> {
		// First fetch: just for authentication (password check)
		const foundShop = await this.authRepo.findShopByEmail(date.email);
		if (!foundShop) throw new Error("Shop not found");
		
		if (!foundShop.password) {
			if (foundShop.accountProvider === 'google') {
				throw new Error("Please login with Google");
			}
			throw new Error("Invalid email or password");
		}

		if (!foundShop.comparePassword || !(await foundShop.comparePassword(date.password)))
			throw new Error("Invalid email or password");

		// Second fetch: get full shop data for response
		const shop = await this.authRepo.findShopByEmail(date.email, "name description location workingHours hotline avatar menus restaurantRating subscribed subscriptionPeriod phoneNumber");
		if (!shop) throw new Error("Shop not found");

		const shopData = await PublicUserProfile.fromRestaurant(shop as any);

		const token = signJwt(PublicUserProfile.toTokenPayloadFromRestaurant(shop as any));
		return {
			token,
			user: shopData,
		};
	}
}

export { ShopLoginStrategy };
