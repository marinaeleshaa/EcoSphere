import { inject, injectable } from "tsyringe";
import { IRegistrationStrategy } from "./registration.service";
import type { IAuthRepository } from "../auth.repository";
import { RegisterResponseDTO, UserRegisterDTO } from "../dto/user.dto";

@injectable()
class EndUserRegistration implements IRegistrationStrategy {
	constructor(
		@inject("IAuthRepository") private readonly authRepository: IAuthRepository
	) {}
	async register(
		data: UserRegisterDTO,
		provider?: string
	): Promise<RegisterResponseDTO> {
		if (!provider) {
			const isUserExists = await this.authRepository.existsByEmail(data.email);
			if (isUserExists) throw new Error("email already exists.");
		}
		const savedUser = await this.authRepository.saveNewUser(data);
		if (!savedUser)
			throw new Error("something went wrong, user can not registered");

		return { success: true };
	}
}

export { EndUserRegistration };
