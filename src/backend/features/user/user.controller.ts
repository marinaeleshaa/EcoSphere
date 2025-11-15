import { inject, injectable } from "tsyringe";
import type { IUserService } from "./user.service";
import { IUser } from "./user.model";
import "reflect-metadata";

@injectable()
class UserController {
	constructor(
		@inject("IUserService") private readonly userService: IUserService
	) {}

	async getAll(): Promise<IUser[]> {
		const users = await this.userService.getAll();
		return users;
	}
}

export default UserController;
