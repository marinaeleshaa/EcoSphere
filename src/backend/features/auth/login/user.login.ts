import { inject, injectable } from "tsyringe";
import { ILoginStrategy } from "./login.service";
import { type IAuthRepository } from "../auth.repository";
import { LoginRequestDTO, LoginResponseDTO, PublicUserProfile } from "../dto/user.dto";
import { signJwt } from "@/backend/utils/helpers";
@injectable()
class UserLoginStrategy implements ILoginStrategy {
	constructor(
		@inject("IAuthRepository") private readonly authRepository: IAuthRepository
	) {}
	async login(data: LoginRequestDTO): Promise<LoginResponseDTO> {
		const foundUser = await this.authRepository.findUserByEmail(data.email);

		if (!foundUser) throw new Error("User not found");
		if (!foundUser.comparePassword || !(await foundUser.comparePassword(data.password)))
			throw new Error("Invalid email or password");

		// Fetch the full user object from the repository
		const user = await this.authRepository.findUserByEmail(data.email, "firstName lastName phoneNumber address avatar birthDate gender favoritesIds cart paymentHistory subscriptionPeriod subscribed events points");
		if (!user) throw new Error("User not found");

		const userData = await PublicUserProfile.fromUser(user as any);

		const token = signJwt(PublicUserProfile.toTokenPayload(user as any));
		return {
			token,
			user: userData,
		};
	}
}

export { UserLoginStrategy };
