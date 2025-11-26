import { inject, injectable } from "tsyringe";
import { IRegistrationStrategy } from "./registration.service";
import type { IAuthRepository } from "../auth.repository";
import { generateToken } from "@/backend/utils/helpers";
import { RegisterRequestDTO, RegisterResponseDTO } from "../dto/user.dto";
import { mapUserAsEndUser, mapUserToTokenPayload } from "../mappers";

@injectable()
class EndUserRegistration implements IRegistrationStrategy {
	constructor(
		@inject("IAuthRepository") private readonly authRepository: IAuthRepository
	) {}
	async register(data: RegisterRequestDTO): Promise<RegisterResponseDTO> {
		const isUserExists = await this.authRepository.existsByEmail(data.email);
		if (isUserExists) throw new Error("email already exists.");
		const savedUser = await this.authRepository.saveNewUser(data);

		const token = generateToken(mapUserToTokenPayload(savedUser));
		return {
			token,
			user: mapUserAsEndUser(savedUser),
		};
	}
}

export { EndUserRegistration };
