import { inject, injectable } from "tsyringe";
import type { ILoginFactory } from "./login.strategy.factory";

interface ILoginStrategy {
	login(data: any): Promise<any>;
}

@injectable()
class LoginService {
	constructor(
		@inject("LoginFactory") private readonly strategyFactory: ILoginFactory
	) {}

	async login(data: any) {
		const strategy = this.strategyFactory.getStrategy(data.userType);
		return await strategy.login(data);
	}
}
export { type ILoginStrategy, LoginService };
