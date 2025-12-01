import { inject, injectable } from "tsyringe";
import { IRegistrationStrategy } from "./registration.service";
import { RegisterResponseDTO, UserRegisterDTO, PublicUserProfile } from "../dto/user.dto";
import type { IAuthRepository } from "../auth.repository";
import { signJwt } from "@/backend/utils/helpers";

@injectable()
class OrganizerRegistration implements IRegistrationStrategy {
	constructor(
		@inject("IAuthRepository") private readonly authRepo: IAuthRepository
	) {}
	async register(data: UserRegisterDTO): Promise<RegisterResponseDTO> {
		console.log(data);
		const isOrganizerExists = await this.authRepo.existsByEmail(data.email);
		if (isOrganizerExists) throw new Error("user already exists.");
		const organizer = await this.authRepo.saveNewUser(data);

		const token = signJwt(PublicUserProfile.toTokenPayload(organizer));

		return await RegisterResponseDTO.create(token, organizer);
	}
}
export { OrganizerRegistration };
