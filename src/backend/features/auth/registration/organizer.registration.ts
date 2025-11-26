import { inject, injectable } from "tsyringe";
import { IRegistrationStrategy } from "./registration.service";
import { RegisterRequestDTO, RegisterResponseDTO } from "../dto/user.dto";
import type { IAuthRepository } from "../auth.repository";
import { generateToken } from "@/backend/utils/helpers";
import { mapUserAsOrganizer, mapUserToTokenPayload } from "../mappers";

@injectable()
class OrganizerRegistration implements IRegistrationStrategy {
	constructor(
		@inject("AuthRepository") private readonly authRepo: IAuthRepository
	) {}
	async register(data: RegisterRequestDTO): Promise<RegisterResponseDTO> {
		console.log(data);
		const isOrganizerExists = await this.authRepo.existsByEmail(data.email);
		if (isOrganizerExists) throw new Error("user already exists.");
		const organizer = await this.authRepo.saveNewUser(data);

		const token = generateToken(mapUserToTokenPayload(organizer));

		return {
			token,
			user: mapUserAsOrganizer(organizer),
		};
	}
}
export { OrganizerRegistration };
