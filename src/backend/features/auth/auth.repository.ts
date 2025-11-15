import { injectable } from "tsyringe";
import { IUser, UserModel } from "../user/user.model";
import { DBInstance } from "../../config/dbConnect";

export interface IAuthRepository {
  register(email: string, name: string, password: string): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  createUser(email: string, name: string, password: string): Promise<IUser>;
  me(): Promise<IUser[]>;
}

@injectable()
class AuthRepository {
  async register(
    email: string,
    name: string,
    password: string
  ): Promise<IUser | null> {
    await DBInstance.getConnection();
    const user = new UserModel({ email, name, passwordHash: password });
    return await user.save();
  }

  async findByEmail(email:string): Promise<IUser |null>{
    await DBInstance.getConnection();
    return await UserModel.findOne({ email });
  }

}

export default AuthRepository;
