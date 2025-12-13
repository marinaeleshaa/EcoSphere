import { inject, injectable } from "tsyringe";
import type { IUserService } from "./user.service";
import { IUser } from "./user.model";
import { DashboardUsers } from "./user.types";
import { IMenuItem } from "../restaurant/restaurant.model";

@injectable()
class UserController {
  constructor(
    @inject("IUserService") private readonly userService: IUserService
  ) {}

  async getAll(): Promise<IUser[]> {
    const users = await this.userService.getAll();
    return users;
  }

  async getById(id: string, query?: string): Promise<IUser> {
    const user = await this.userService.getById(id, query);
    return user;
  }

  async getDashBoard(
    limit?: number,
    sortBy?: string,
    sortOrder?: 1 | -1,
    selectFields?: string | Record<string, 0 | 1>
  ): Promise<DashboardUsers> {
    const result = await this.userService.getDashBoardData(
      limit,
      sortBy,
      sortOrder,
      selectFields
    );
    return result;
  }

  async redeemUserPoints(userId: string) {
    if (!userId) return;
    const result = await this.userService.redeemUserPoints(userId);
    return result;
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

  getFavoriteMenuItems(itemIds: string[]): Promise<IMenuItem[]> {
    return this.userService.getFavoriteMenuItems(itemIds);
  }

  async deleteById(id: string): Promise<IUser> {
    const user = await this.userService.deleteById(id);
    return user;
  }
}

export default UserController;
