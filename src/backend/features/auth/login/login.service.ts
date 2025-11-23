import { inject, injectable } from "tsyringe";
import type { ILoginFactory } from "./login.strategy.factory";
import { LoginRequestDTO, LoginResponseDTO } from "../dto/user.dto";

interface ILoginStrategy {
	login(data: LoginRequestDTO): Promise<LoginResponseDTO>;
}

@injectable()
class LoginService {
	constructor(
		@inject("LoginFactory") private readonly strategyFactory: ILoginFactory
	) {}

	async login(data: LoginRequestDTO) {
		const strategy = this.strategyFactory.getStrategy(data.loginType);
		return await strategy.login(data);
	}
}
export { type ILoginStrategy, LoginService };
