import { inject, injectable } from "tsyringe";
import type { IUserRepository } from "./user.repository";
import { IUser} from "./user.model";

export interface IUserService {
  getAll(): Promise<IUser[]>;
  getById(id: string): Promise<IUser | null>;
  updateById(id: string, data: Partial<IUser>): Promise<IUser | null>;
  updateFavorites(id: string, data: string): Promise<IUser | null>;
  deleteById(id: string): Promise<IUser | null>;
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

  async getById(id: string): Promise<IUser | null> {
    return await this.userRepository.getById(id);
  }

  // Needs to Updated later when we have Avatar Upload functionality
  async updateById(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return await this.userRepository.updateById(id, data);
  }

  async updateFavorites(id: string, data: string): Promise<IUser | null> {
    return await this.userRepository.updateFavorites(id, data);
  }

  async deleteById(id: string): Promise<IUser | null> {
    return await this.userRepository.deleteById(id);
  }
}

export default UserService;
