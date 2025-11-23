import { inject, injectable } from "tsyringe";
import { ILoginStrategy } from "./login.service";
import { type IAuthRepository } from "../auth.repository";
import type { LoginRequestDTO, LoginResponseDTO } from "../dto/user.dto";
import { generateToken } from "@/backend/utils/helpers";
import { mapUserToPublicProfile } from "../mappers";
@injectable()
class UserLoginStrategy implements ILoginStrategy {
	constructor(
		@inject("IAuthRepository") private readonly authRepository: IAuthRepository
	) {}
	async login(data: LoginRequestDTO): Promise<LoginResponseDTO> {
		const user = await this.authRepository.findUserByEmail(data.email);

		if (!user) throw new Error("User not found");
		if (!(await user.comparePassword(data.password)))
			throw new Error("Invalid email or password");

		const userData = mapUserToPublicProfile(user);

		const token = generateToken(userData);
		return {
			token,
			user: userData,
		};
	}
}

export { UserLoginStrategy };
