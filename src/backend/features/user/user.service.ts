import { inject, injectable } from "tsyringe";
import type { IUserRepository } from "./user.repository";
import { IUser } from "./user.model";
import { ImageService } from "../../services/image.service";

export interface IUserService {
  getAll(): Promise<IUser[]>;
  getById(id: string): Promise<IUser>;
  getUserIdByEmail(email: string): Promise<IUser>;
  updateById(id: string, data: Partial<IUser>): Promise<IUser>;
  updateFavorites(id: string, data: string): Promise<IUser>;
  deleteById(id: string): Promise<IUser>;
}

@injectable()
class UserService {
  constructor(
    @inject("IUserRepository") private readonly userRepository: IUserRepository,
    @inject("ImageService") private readonly imageService: ImageService
  ) {}

  async getAll(): Promise<IUser[]> {
    const users = await this.userRepository.getAll();
    return await Promise.all(users.map((user) => this.populateAvatar(user)));
  }

  async getById(id: string): Promise<IUser> {
    const user = await this.userRepository.getById(id);
    return await this.populateAvatar(user);
  }
  async getUserIdByEmail(email: string): Promise<IUser> {
    const user = await this.userRepository.getUserIdByEmail(email);
    if (!user) throw new Error("User not found");
    return await this.populateAvatar(user);
  }

  // Needs to Updated later when we have Avatar Upload functionality
  async updateById(id: string, data: Partial<IUser>): Promise<IUser> {
    const user = await this.userRepository.updateById(id, data);
    return await this.populateAvatar(user);
  }

  async updateFavorites(id: string, data: string): Promise<IUser> {
    const user = await this.userRepository.updateFavorites(id, data);
    return await this.populateAvatar(user);
  }

  async deleteById(id: string): Promise<IUser> {
    const user = await this.userRepository.deleteById(id);
    return await this.populateAvatar(user);
  }

  private async populateAvatar(user: IUser): Promise<IUser> {
    const userObj =
      user && typeof user.toObject === "function" ? user.toObject() : user;

    if (userObj?.avatar?.key) {
      userObj.avatar.url = await this.imageService.getSignedUrl(
        userObj.avatar.key
      );
    }
    return userObj as IUser;
  }
}

export default UserService;
