import { injectable } from "tsyringe";
import { IUser, UserModel, UserRole } from "./user.model";
import { DBInstance } from "@/backend/config/dbConnect";
import { DashboardUsers } from "./user.types";
import { ProjectionFields, Types } from "mongoose";
import { IMenuItem, RestaurantModel } from "../restaurant/restaurant.model";

export interface IUserRepository {
  getAll(): Promise<IUser[]>;
  getById(id: string, query?: string): Promise<IUser>;
  getFavoriteMenuItems(itemIds: string[]): Promise<IMenuItem[]>;
  getUsersByRoleAdvanced(options?: {
    limit?: number;
    sortBy?: string;
    sortOrder?: 1 | -1;
    selectFields?: string | Record<string, 0 | 1>;
  }): Promise<DashboardUsers>;
  redeemPoints(userId: string): Promise<IUser>;
  getUserIdByEmail(email: string): Promise<IUser>;
  updateById(id: string, data: Partial<IUser>): Promise<IUser>;
  updateFavorites(id: string, data: string): Promise<IUser>;
  deleteById(id: string): Promise<IUser>;
}

@injectable()
class UserRepository implements IUserRepository {
  async getAll(): Promise<IUser[]> {
    await DBInstance.getConnection();
    return await UserModel.find({}, { password: 0 }).lean<IUser[]>().exec();
  }

  async getById(
    id: string,
    query: string = "email firstName lastName avatar phoneNumber"
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
      .lean<IUser>()
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

    const facets = roles.reduce((acc, role) => {
      acc[role] = [
        { $match: { role } },
        { $sort: { [sortBy]: sortOrder } },
        { $limit: limit },
        { $project: projectStage },
      ];
      return acc;
    }, {} as Record<string, any[]>);

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
      { new: true }
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

  async updateById(id: string, data: Partial<IUser>): Promise<IUser> {
    await DBInstance.getConnection();
    const updatedUser = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedUser) {
      throw new Error(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  async updateFavorites(id: string, item: string): Promise<IUser> {
    await DBInstance.getConnection();

    // Attempt to add the item (if not present)
    let updatedUser = await UserModel.findOneAndUpdate(
      { _id: id, favoritesIds: { $ne: item } },
      { $addToSet: { favoritesIds: item } },
      { new: true, projection: { favoritesIds: 1, _id: 0 } }
    );

    if (updatedUser) {
      return updatedUser;
    }

    // If the item was already in favorites, remove it
    updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $pull: { favoritesIds: item } },
      { new: true, projection: { favoritesIds: 1, _id: 0 } }
    );

    return updatedUser;
  }

  async getFavoriteMenuItems(itemIds: string[]): Promise<IMenuItem[]> {
    if (itemIds.length === 0) return [];
    await DBInstance.getConnection();

    const objectIds = itemIds.map((id) => new Types.ObjectId(id));

    const restaurants = await RestaurantModel.find({
      "menus._id": { $in: objectIds },
    })
      .select("menus")
      .lean()
      .exec();

    const favoriteItems: IMenuItem[] = [];

    restaurants.forEach((restaurant) => {
      restaurant.menus.forEach((menu: IMenuItem) => {
        if (objectIds.some((id) => id.equals(menu._id))) {
          favoriteItems.push(menu);
        }
      });
    });

    return favoriteItems;
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
    selectFields: string | Record<string, 0 | 1>
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
