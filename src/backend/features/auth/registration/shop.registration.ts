import { inject, injectable, container } from "tsyringe";
import { IRegistrationStrategy } from "./registration.service";
import { RegisterResponseDTO, ShopRegisterDTO } from "../dto/user.dto";
import type { IAuthRepository } from "../auth.repository";
import { ImageService } from "@/backend/services/image.service";

@injectable()
class ShopRegistration implements IRegistrationStrategy {
	constructor(
		@inject("IAuthRepository") private readonly authRepo: IAuthRepository
	) {}
	async register(data: ShopRegisterDTO): Promise<RegisterResponseDTO> {
		const isShopExists = await this.authRepo.existsShopByEmail(data.email);
		if (isShopExists) throw new Error("user already exists.");

		let avatarKey = data.avatar;

		// Check if avatar is a Base64 string
		if (data.avatar?.startsWith("data:image")) {
			const matches = data.avatar.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
			if (matches?.length === 3) {
				const mimeType = matches[1];
				const buffer = Buffer.from(matches[2], "base64");

				const imageService = container.resolve(ImageService);
				avatarKey = await imageService.uploadImage(buffer, mimeType);
			}
		}

		// Create a copy of data with the key instead of Base64
		const shopData = { ...data, avatar: avatarKey };

		const savedShop = await this.authRepo.saveNewShop(shopData);
		if (!savedShop) throw new Error("something went wrong, shop can not registered");
		return { success: true };
	}
}
export { ShopRegistration };
