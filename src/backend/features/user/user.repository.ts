import { injectable } from "tsyringe";
import { ICart, IUser, UserModel, UserRole } from "./user.model";
import { DBInstance } from "@/backend/config/dbConnect";
import { DashboardUsers } from "./user.types";
import { ProjectionFields, Types } from "mongoose";
import { IMenuItem, RestaurantModel } from "../restaurant/restaurant.model";
import { ProductResponse } from "../product/dto/product.dto";

export interface IUserRepository {
  getAll(): Promise<IUser[]>;
  getById(id: string, query?: string): Promise<IUser>;
  getFavoriteMenuItems(itemIds: string[]): Promise<ProductResponse[]>;
  getUsersByRoleAdvanced(options?: {
    limit?: number;
    sortBy?: string;
    sortOrder?: 1 | -1;
    selectFields?: string | Record<string, 0 | 1>;
  }): Promise<DashboardUsers>;
  redeemPoints(userId: string): Promise<IUser>;
  getUserIdByEmail(email: string): Promise<IUser>;
  getUserByStripeId(stripeCustomerId: string): Promise<IUser | null>;
  saveCart(userId: string, cart: ICart[]): Promise<IUser>;
  updateById(id: string, data: Partial<IUser>): Promise<IUser>;
  updateFavorites(id: string, data: string): Promise<IUser>;
  deleteById(id: string): Promise<IUser>;
  savePasswordResetCode(
    userId: string,
    code: string,
    validTo: string,
  ): Promise<void>;
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean>;
}

@injectable()
class UserRepository implements IUserRepository {
  async getAll(): Promise<IUser[]> {
    await DBInstance.getConnection();
    return await UserModel.find({}, { password: 0 }).lean<IUser[]>().exec();
  }

  async getById(
    id: string,
    query: string = "email firstName lastName avatar phoneNumber",
  ): Promise<IUser> {
    await DBInstance.getConnection();
    let projection: ProjectionFields<IUser> = {};

    if (!query || query.trim() === "") {
      projection = { password: 0 };
    } else {
      query
        .trim()
        .split(/\s+/)
        .filter((f) => f !== "password")
        .forEach((field) => {
          projection[field] = 1;
        });
    }

    const user = await UserModel.findById(id, projection)
      .populate("favoritesIds")
      .exec();

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  async getUsersByRoleAdvanced(options?: {
    limit?: number;
    sortBy?: string;
    sortOrder?: 1 | -1;
    selectFields?: string | Record<string, 0 | 1>;
  }): Promise<DashboardUsers> {
    await DBInstance.getConnection();
    const {
      limit = 5,
      sortBy = "createdAt",
      sortOrder = -1,
      selectFields = "-password -cart -paymentHistory",
    } = options || {};

    const roles: UserRole[] = ["organizer", "admin", "recycleMan"];
    // Convert selectFields to $project format
    const projectStage = this.parseSelectFields(selectFields);

    const facets = roles.reduce(
      (acc, role) => {
        acc[role] = [
          { $match: { role } },
          { $sort: { [sortBy]: sortOrder } },
          { $limit: limit },
          { $project: projectStage },
        ];
        return acc;
      },
      {} as Record<string, any[]>,
    );

    const result = await UserModel.aggregate()
      .match({ role: { $ne: "customer" } })
      .facet(facets)
      .exec();

    return result[0] as DashboardUsers;
  }

  async redeemPoints(userId: string) {
    await DBInstance.getConnection();
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { points: 0 } },
      { new: true },
    )
      .select("email points")
      .lean<IUser>()
      .exec();
    return user!;
  }

  async getUserIdByEmail(email: string): Promise<IUser> {
    await DBInstance.getConnection();
    const response = await UserModel.findOne({ email })
      .select("_id")
      .lean<IUser>()
      .exec();
    return response!;
  }

  async getUserByStripeId(stripeCustomerId: string): Promise<IUser> {
    await DBInstance.getConnection();
    const user = await UserModel.findOne({ stripeCustomerId })
      .select("subscriptionPeriod")
      .exec();
    return user!;
  }

  async updateById(id: string, data: Partial<IUser>): Promise<IUser> {
    await DBInstance.getConnection();

    const user = await UserModel.findById(id);

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    Object.assign(user, data);

    const updatedUser = await user.save();

    return updatedUser;
  }

  async updateFavorites(id: string, item: string): Promise<IUser> {
    await DBInstance.getConnection();

    // Attempt to add the item (if not present)
    let updatedUser = await UserModel.findOneAndUpdate(
      { _id: id, favoritesIds: { $ne: item } },
      { $addToSet: { favoritesIds: item } },
      { new: true, projection: { favoritesIds: 1, _id: 0 } },
    )
      .lean<IUser>()
      .exec();

    if (updatedUser) {
      return updatedUser;
    }

    // If the item was already in favorites, remove it
    updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $pull: { favoritesIds: item } },
      { new: true, projection: { favoritesIds: 1, _id: 0 } },
    )
      .lean<IUser>()
      .exec();

    return updatedUser!;
  }

  async getFavoriteMenuItems(itemIds: string[]): Promise<ProductResponse[]> {
    if (itemIds.length === 0) return [];
    await DBInstance.getConnection();

    const objectIds = itemIds.map((id) => new Types.ObjectId(id));

    const restaurants = await RestaurantModel.find({
      "menus._id": { $in: objectIds },
    })
      .select("_id name menus")
      .lean()
      .exec();

    const favoriteItems: ProductResponse[] = [];

    restaurants.forEach((restaurant) => {
      restaurant.menus.forEach((menu: IMenuItem) => {
        if (objectIds.some((id) => id.equals(menu._id))) {
          console.log(
            "[getFavoriteMenuItems] Menu item from DB:",
            JSON.stringify(
              {
                menuId: menu._id?.toString(),
                menuTitle: menu.title,
                hasAvatar: !!menu.avatar,
                avatar: menu.avatar,
                avatarKey: menu.avatar?.key,
                avatarUrl: menu.avatar?.url,
              },
              null,
              2,
            ),
          );

          favoriteItems.push({
            ...menu,
            restaurantId: restaurant._id,
            restaurantName: restaurant.name,
          } as ProductResponse);
        }
      });
    });

    console.log(
      "[getFavoriteMenuItems] Returning",
      favoriteItems.length,
      "items",
    );
    return favoriteItems;
  }

  async saveCart(userId: string, cart: ICart[]): Promise<IUser> {
    await DBInstance.getConnection();
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { cart },
      { new: true },
    )
      .lean<IUser>()
      .exec();

    return user!;
  }

  async savePasswordResetCode(
    userId: string,
    code: string,
    validTo: string,
  ): Promise<void> {
    await DBInstance.getConnection();
    await UserModel.findByIdAndUpdate(
      userId,
      { resetCode: { code, validTo } },
      { new: true },
    );
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    await DBInstance.getConnection();
    const user = await UserModel.findById(userId).select("password");

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return false;
    }

    user.password = newPassword;
    await user.save();

    return true;
  }

  async deleteById(id: string): Promise<IUser> {
    await DBInstance.getConnection();
    const user = await this.getById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return await user.deleteOne();
  }

  // Helper function to convert Mongoose select syntax to $project
  private parseSelectFields(
    selectFields: string | Record<string, 0 | 1>,
  ): Record<string, 0 | 1> {
    // If already an object, return as is
    if (typeof selectFields === "object") {
      return selectFields;
    }

    // Parse string format like "-password -cart" or "email firstName lastName"
    const projection: Record<string, 0 | 1> = {};
    const fields = selectFields.trim().split(/\s+/);

    fields.forEach((field) => {
      if (field.startsWith("-")) {
        // Exclude field
        projection[field.substring(1)] = 0;
      } else if (field) {
        // Include field
        projection[field] = 1;
      }
    });
    return projection;
  }
}

export default UserRepository;
