import { inject, injectable } from "tsyringe";
import type { IRegistrationStrategy } from "./registration.service";

interface IRegistrationFactory {
	getStrategy(userType: string): IRegistrationStrategy;
}

@injectable()
class RegistrationFactory implements IRegistrationFactory {
	constructor(
		@inject("EndUserRegistration")
		private readonly userStrategy: IRegistrationStrategy,
		@inject("OrganizerRegistration")
		private readonly organizerStrategy: IRegistrationStrategy,
		@inject("ShopRegistration")
		private readonly shopStrategy: IRegistrationStrategy
	) {}

	getStrategy(userType: string): IRegistrationStrategy {
		console.log(userType);
		switch (userType) {
      case "customer":
        return this.userStrategy;
      case "organizer":
        return this.organizerStrategy;
      case "shop":
        return this.shopStrategy;
      default:
        throw new Error("Invalid user type, from strategy factory");
    }
	}
}
export { RegistrationFactory, type IRegistrationFactory };
