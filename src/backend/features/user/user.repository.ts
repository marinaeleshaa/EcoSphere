import { injectable } from "tsyringe";
import { IUser, UserModel } from "./user.model";
import { DBInstance } from "../../config/dbConnect";

export interface IUserRepository {
  getAll(): Promise<IUser[]>;
}

@injectable()
class UserRepository {
  async getAll(): Promise<IUser[]> {
    await DBInstance.getConnection();
    return await UserModel.find();
  }
}

export default UserRepository;
