import { inject, injectable } from "tsyringe";
import type { ILoginStrategy } from "./login.service";
import { IStrategyFactory } from "../IStrategyFactory";

type ILoginFactory = IStrategyFactory<ILoginStrategy>;

@injectable()
class LoginFactory implements ILoginFactory {
	constructor(
		@inject("UserLoginStrategy") private readonly userStrategy: ILoginStrategy,
		@inject("ShopLoginStrategy") private readonly shopStrategy: ILoginStrategy
	) {}
	getStrategy(userType: string): ILoginStrategy {
		switch (userType) {
			case "user":
				return this.userStrategy;
			case "shop":
				return this.shopStrategy;
			default:
				throw new Error(`Unknown type, ${userType}`);
		}
	}
}

export { LoginFactory, type ILoginFactory };
