import { inject, injectable } from "tsyringe";
import { type IAuthRepository } from "../auth.repository";
import type {
	FoundedUser,
	LoginRequestDTO,
	LoginResponse,
} from "../dto/user.dto";
import { mapToUserPublicProfile } from "../mappers";

@injectable()
class LoginService {
	constructor(
		@inject("IAuthRepository") private readonly authRepository: IAuthRepository
	) {}
	async login(data: LoginRequestDTO): Promise<LoginResponse> {
		let user = await this.authRepository.findShopByEmail(data.email);

		if (!user) user = await this.authRepository.findUserByEmail(data.email);
		if (!user) throw new Error("User not found");

		if (!(await user.comparePassword!(data.password)))
			throw new Error("Invalid email or password");
		return mapToUserPublicProfile(user);
	}

	async findByEmail(email: string, key: string): Promise<FoundedUser> {
		let user = await this.authRepository.findShopByEmail(email, key);

		if (!user) user = await this.authRepository.findUserByEmail(email, key);
		if (!user.oAuthId || user.password)
			throw new Error("user must login using email and password");

		return user;
	}
}

export { LoginService };
