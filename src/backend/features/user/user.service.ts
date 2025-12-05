import { inject, injectable } from "tsyringe";
import type { IUserRepository } from "./user.repository";
import { IUser} from "./user.model";

export interface IUserService {
  getAll(): Promise<IUser[]>;
  getById(id: string): Promise<IUser>;
  getUserIdByEmail(email: string): Promise<IUser>
  updateById(id: string, data: Partial<IUser>): Promise<IUser>;
  updateFavorites(id: string, data: string): Promise<IUser>;
  deleteById(id: string): Promise<IUser>;
}

@injectable()
class UserService {
  constructor(
    @inject("IUserRepository") private readonly userRepository: IUserRepository
  ) {}

  async getAll(): Promise<IUser[]> {
    const users = await this.userRepository.getAll();
    return users;
  }

  async getById(id: string): Promise<IUser> {
    return await this.userRepository.getById(id);
  }
  async getUserIdByEmail(email:string): Promise<IUser> {
    const user = this.userRepository.getUserIdByEmail(email);
    if (!user) throw new Error("User not found");
    return user
  }

  // Needs to Updated later when we have Avatar Upload functionality
  async updateById(id: string, data: Partial<IUser>): Promise<IUser> {
    return await this.userRepository.updateById(id, data);
  }

  async updateFavorites(id: string, data: string): Promise<IUser> {
    return await this.userRepository.updateFavorites(id, data);
  }

  async deleteById(id: string): Promise<IUser> {
    return await this.userRepository.deleteById(id);
  }
}

export default UserService;
