import { inject, injectable } from "tsyringe";
import type { IUserService } from "./user.service";
import { IUser } from "./user.model";

@injectable()
class UserController {
  constructor(
    @inject("IUserService") private readonly userService: IUserService
  ) {}

  async getAll(): Promise<IUser[]> {
    const users = await this.userService.getAll();
    return users;
  }

  async getById(id: string): Promise<IUser> {
    const user = await this.userService.getById(id);
    return user;
  }
  async getUserIdByEmail(email: string): Promise<IUser> {
    return await this.userService.getUserIdByEmail(email);
  }
  async updateById(id: string, data: Partial<IUser>): Promise<IUser> {
    const user = await this.userService.updateById(id, data);
    // Use DTO factory method to map user to profile with avatar URL
    return user;
  }
  async updateFavorites(id: string, data: string): Promise<IUser> {
    const user = await this.userService.updateFavorites(id, data);
    return user;
  }
  async deleteById(id: string): Promise<IUser> {
    const user = await this.userService.deleteById(id);
    return user;
  }
}

export default UserController;
