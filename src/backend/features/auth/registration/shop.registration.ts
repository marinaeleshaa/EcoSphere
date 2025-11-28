import { inject, injectable } from "tsyringe";
import { IRegistrationStrategy } from "./registration.service";
import { RegisterResponseDTO, ShopRegisterDTO } from "../dto/user.dto";
import type { IAuthRepository } from "../auth.repository";

@injectable()
class ShopRegistration implements IRegistrationStrategy {
	constructor(
		@inject("IAuthRepository") private readonly authRepo: IAuthRepository
	) {}
	async register(data: ShopRegisterDTO): Promise<RegisterResponseDTO> {
		const isShopExists = await this.authRepo.existsShopByEmail(data.email);
		if (isShopExists) throw new Error("user already exists.");
		const savedShop = await this.authRepo.saveNewShop(data);
		if (!savedShop)
			throw new Error("something went wrong, shop can not be saved.");
		return { success: true };
	}
}
export { ShopRegistration };
