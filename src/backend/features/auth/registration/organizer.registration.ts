import { inject, injectable } from "tsyringe";
import { IRegistrationStrategy } from "./registration.service";
import { RegisterResponseDTO, UserRegisterDTO } from "../dto/user.dto";
import type { IAuthRepository } from "../auth.repository";

@injectable()
class OrganizerRegistration implements IRegistrationStrategy {
	constructor(
		@inject("IAuthRepository") private readonly authRepo: IAuthRepository
	) {}
	async register(data: UserRegisterDTO): Promise<RegisterResponseDTO> {
		const isOrganizerExists = await this.authRepo.existsByEmail(data.email);
		if (isOrganizerExists) throw new Error("user already exists.");
		const organizer = await this.authRepo.saveNewUser(data);
		if (!organizer)
			throw new Error("something went wrong, organizer can not registered");
		return { success: true };
	}
}
export { OrganizerRegistration };
