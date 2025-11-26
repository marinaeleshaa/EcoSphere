import { inject, injectable } from "tsyringe";
import { IRegistrationStrategy } from "./registration.service";
import { RegisterRequestDTO, RegisterResponseDTO } from "../dto/user.dto";
import type { IAuthRepository } from "../auth.repository";
import { mapRestaurantToTokenPayload, mapShopToPublicProfile } from "../mappers";
import { generateToken } from "@/backend/utils/helpers";

@injectable()
class ShopRegistration implements IRegistrationStrategy {
	constructor(
		@inject("AuthRepository") private readonly authRepo: IAuthRepository
	) {}
	async register(data: RegisterRequestDTO): Promise<RegisterResponseDTO> {
		const isShopExists = await this.authRepo.existsByEmail(data.email);
		if (isShopExists) throw new Error("user already exists.");
		const savedShop = await this.authRepo.saveNewShop(data);
		const token = generateToken(mapRestaurantToTokenPayload(savedShop));
		return {
			token,
			user: mapShopToPublicProfile(savedShop),
		};
	}
}
export { ShopRegistration };
