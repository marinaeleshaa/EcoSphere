import { inject, injectable } from "tsyringe";
import { User } from "@/generated/prisma/client";
import type { LoginRequestDTO, RegisterRequestDTO } from "./dto/user.dto";
import type { IRegistrationStrategy } from "./registration/registration.service";
import type { ILoginStrategy } from "./login/login.service";

@injectable()
class AuthController {
	constructor(
		@inject("RegistrationService")
		private readonly registrationService: IRegistrationStrategy,
		@inject("LoginService") private readonly loginService: ILoginStrategy
	) {}

	async login(
		loginDto: LoginRequestDTO
	): Promise<{ token: string; user: Omit<User, "password"> } | null> {
		return await this.loginService.login(loginDto);
	}

	async register(
		registerDto: RegisterRequestDTO
	): Promise<{ token: string; user: Omit<User, "password"> } | null> {
		return await this.registrationService.register(registerDto);
	}
}

export default AuthController;
