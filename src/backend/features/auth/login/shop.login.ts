import { inject, injectable } from "tsyringe";
import { ILoginStrategy, LoginResponseDTO } from "./login.service";
import { LoginRequestDTO, PublicUserProfile } from "../dto/user.dto";
import type { IAuthRepository } from "../auth.repository";
import { signJwt } from "@/backend/utils/helpers";

@injectable()
class ShopLoginStrategy implements ILoginStrategy {
	constructor(
		@inject("IAuthRepository") private readonly authRepo: IAuthRepository
	) {}
	async login(date: LoginRequestDTO): Promise<LoginResponseDTO> {
		console.log(date);
		const shop = await this.authRepo.findShopByEmail(date.email);
		if (!shop) throw new Error("Shop not found");
		if (!shop.comparePassword || !(await shop.comparePassword(date.password)))
			throw new Error("Invalid email or password");

		const shopData = await PublicUserProfile.fromRestaurant(shop as any);

		const token = signJwt(PublicUserProfile.toTokenPayloadFromRestaurant(shop as any));
		return {
			token,
			user: shopData,
		};
	}
}

export { ShopLoginStrategy };
