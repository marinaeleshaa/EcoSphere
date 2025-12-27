import { inject, injectable } from "tsyringe";
import type { IUserService } from "./user.service";
import { ICart, IUser } from "./user.model";
import { DashboardUsers } from "./user.types";
import { IProductCart, IProduct } from "@/types/ProductType";

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
  
  async getRecycleAgents() { 
    const agents = await this.userService.getRecycleAgents();
    return agents;
  }

  async redeemUserPoints(userId: string) {
    if (!userId) return;
    const result = await this.userService.redeemUserPoints(userId);
    return result;
  }

  async getUserIdByEmail(email: string): Promise<IUser> {
    return await this.userService.getUserIdByEmail(email);
  }

  async getUserCart(
    userId: string
  ): Promise<{ success: boolean; items: IProductCart[] }> {
    const cart = await this.userService.getCart(userId);
    return cart;
  }
  async updateById(id: string, data: Partial<IUser>): Promise<IUser> {
    const user = await this.userService.updateById(id, data);
    // Use DTO factory method to map user to profile with avatar URL
    return user;
  }

  async saveUserCart(userId: string, cart: ICart[]): Promise<IUser> {
    const user = await this.userService.saveUserCart(userId, cart);
    return user;
  }

  async updateFavorites(id: string, data: string): Promise<IUser> {
    const user = await this.userService.updateFavorites(id, data);
    return user;
  }

  async saveFavorites(userId: string, favorites: string[]): Promise<IUser> {
    const user = await this.userService.saveFavorites(userId, favorites);
    return user;
  }

  async clearFavorites(userId: string): Promise<IUser> {
    const user = await this.userService.clearFavorites(userId);
    return user;
  }

  getFavoriteMenuItems(itemIds: string[]): Promise<IProduct[]> {
    return this.userService.getFavoriteMenuItems(itemIds);
  }

  async deleteById(id: string): Promise<IUser> {
    const user = await this.userService.deleteById(id);
    return user;
  }

  async sendForgetPasswordEmail(email: string): Promise<{ message: string }> {
    const result = await this.userService.sendForgetPasswordEmail(email);
    return result;
  }

  async verifyCode(email: string, code: string): Promise<{ message: string }> {
    const result = await this.userService.verifyCode(email, code);
    return result;
  }

  async resetPassword(
    email: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const result = await this.userService.resetPassword(email, newPassword);
    return result;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const result = await this.userService.changePassword(
      userId,
      currentPassword,
      newPassword
    );
    return result;
  }
}

export default UserController;
