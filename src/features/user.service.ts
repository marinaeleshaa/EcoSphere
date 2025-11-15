import { inject, injectable } from "tsyringe";
import type { IUserRepository } from "./user.repository";
import { IUser } from "./user.model";


export interface IUserService {
	getAll(): Promise<IUser[]>;
}

@injectable()
class UserService {
	constructor(
		@inject("IUserRepository") private readonly userRepository: IUserRepository
	) {}

	async getAll(): Promise<IUser[]> {
		return await this.userRepository.getAll();
	}
}

export default UserService;
