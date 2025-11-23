import { inject, injectable } from "tsyringe";
import { ILoginStrategy } from "./login.service";
import { LoginRequestDTO, LoginResponseDTO } from "../dto/user.dto";
import type { IAuthRepository } from "../auth.repository";
import { mapShopToPublicProfile } from "../mappers";
import { generateToken } from "@/backend/utils/helpers";

@injectable()
class ShopLoginStrategy implements ILoginStrategy {
	constructor(
		@inject("IAuthRepository") private readonly authRepo: IAuthRepository
	) {}
	async login(date: LoginRequestDTO): Promise<LoginResponseDTO> {
		console.log(date);
		const shop = await this.authRepo.findShopByEmail(date.email);
		if (!shop) throw new Error("Shop not found");
		if (!(await shop.comparePassword(date.password)))
			throw new Error("Invalid email or password");

		const shopData = mapShopToPublicProfile(shop);

		const token = generateToken(shopData);
		return {
			token,
			user: shopData,
		};
	}
}

export { ShopLoginStrategy };
