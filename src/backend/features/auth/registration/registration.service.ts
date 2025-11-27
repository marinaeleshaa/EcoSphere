import { inject, injectable } from "tsyringe";
import type { IRegistrationFactory } from "./registration.strategy.factory";
import { RegisterRequestDTO, RegisterResponseDTO } from "../dto/user.dto";

interface IRegistrationStrategy {
	register(data: RegisterRequestDTO): Promise<RegisterResponseDTO>;
}

@injectable()
class RegistrationService {
	constructor(
		@inject("RegistrationFactory")
		private readonly strategyFactory: IRegistrationFactory
	) {}

	async register(data: RegisterRequestDTO): Promise<RegisterResponseDTO> {
		const strategy = this.strategyFactory.getStrategy(data.role);
		return await strategy.register(data);
	}
}

export { RegistrationService, type IRegistrationStrategy };
