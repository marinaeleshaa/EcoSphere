import { injectable } from "tsyringe";
import { IUser, UserModel } from "./user.model";
import { DB } from "../config/dbConnect";

export interface IUserRepository {
	getAll(): Promise<IUser[]>;
}

@injectable()
class UserRepository {
	async getAll(): Promise<IUser[]> {
		await DB();
		return await UserModel.find();
	}
}

export default UserRepository;
