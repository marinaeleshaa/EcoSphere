import { inject, injectable } from "tsyringe";
import type { IUserService } from "./user.service";
import { ICart, IUser } from "./user.model";
import { DashboardUsers } from "./user.types";
import { IProductCart } from "@/types/ProductType";

@injectable()
class UserController {
  constructor(
    @inject("IUserService") private readonly userService: IUserService,
  ) {}

  async getAll(): Promise<IUser[]> {
    const users = await this.userService.getAll();
    return users;
  }

  async getById(id: string): Promise<IUser> {
    const user = await this.userService.getById(id);
    return user;
  }

  async getDashBoard(
    limit?: number,
    sortBy?: string,
    sortOrder?: 1 | -1,
    selectFields?: string | Record<string, 0 | 1>,
  ): Promise<DashboardUsers> {
    const result = await this.userService.getDashBoardData(
      limit,
      sortBy,
      sortOrder,
      selectFields,
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
  async deleteById(id: string): Promise<IUser> {
    const user = await this.userService.deleteById(id);
    return user;
  }
}

export default UserController;
