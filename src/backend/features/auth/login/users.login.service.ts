import { inject, injectable } from "tsyringe";
import { type IAuthRepository } from "../auth.repository";
import {
	mapToUserPublicProfile,
	type LoginRequestDTO,
	type LoginResponse,
} from "../dto/user.dto";
import { IUser } from "../../user/user.model";
import { IRestaurant } from "../../restaurant/restaurant.model";

export interface ILoginService {
	login(data: LoginRequestDTO): Promise<LoginResponse>;
	findByEmail(email: string, key: string): Promise<boolean>;
}

@injectable()
class LoginService {
	constructor(
		@inject("IAuthRepository") private readonly authRepository: IAuthRepository
	) {}
	async login(data: LoginRequestDTO): Promise<LoginResponse> {
		let user: IUser | IRestaurant = await this.authRepository.findShopByEmail(
			data.email
		);

		if (!user) user = await this.authRepository.findUserByEmail(data.email);
		if (!user) throw new Error("User not found");

		if (!(await user.comparePassword(data.password)))
			throw new Error("Invalid email or password");

		return mapToUserPublicProfile(user);
	}

	async findByEmail(email: string, key: string): Promise<boolean> {
		let user: IUser | IRestaurant = await this.authRepository.findShopByEmail(
			email,
			key
		);

		if (!user) user = await this.authRepository.findUserByEmail(email, key);
		if (user?.password) {
			console.error("user must login using email and password");
			return false;
		}
		return true;
	}
}

export { LoginService };
