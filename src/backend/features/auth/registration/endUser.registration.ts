import { inject, injectable } from "tsyringe";
import { IRegistrationStrategy } from "./registration.service";
import type { IAuthRepository } from "../auth.repository";
import { generateToken } from "@/backend/utils/helpers";
import { RegisterRequestDTO, RegisterResponseDTO } from "../dto/user.dto";
import { mapUserToPublicProfile } from "../mappers";

@injectable()
class EndUserRegistration implements IRegistrationStrategy {
	constructor(
		@inject("IAuthRepository") private readonly authRepository: IAuthRepository
	) {}
	async register(data: RegisterRequestDTO): Promise<RegisterResponseDTO> {
		const isUserExists = await this.authRepository.existsByEmail(data.email);
		if (isUserExists) throw new Error("email already exists.");
		const savedUser = await this.authRepository.saveNewUser(data);

		// create a user data object for token generation and response
		const userData = mapUserToPublicProfile(savedUser);

		const token = generateToken(userData);
		return {
			token,
			user: userData,
		};
	}
}

export { EndUserRegistration };
