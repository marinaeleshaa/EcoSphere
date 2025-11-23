import { injectable } from "tsyringe";
import { IUser, UserModel } from "./user.model";
import { DBInstance } from "@/backend/config/dbConnect";

export interface IUserRepository {
  getAll(): Promise<IUser[]>;
  getById(id: string): Promise<IUser | null>;
  updateById(id: string, data: Partial<IUser>): Promise<IUser | null>;
  updateFavorites(id: string, data: string): Promise<IUser | null>;
  deleteById(id: string): Promise<IUser | null>;
}

@injectable()
class UserRepository {
  async getAll(): Promise<IUser[]> {
    await DBInstance.getConnection();
    return await UserModel.find({}, { password: 0 });
  }
  async getById(id: string): Promise<IUser | null> {
    await DBInstance.getConnection();
    return await UserModel.findById(id, { password: 0 });
  }

  async updateById(id: string, data: Partial<IUser>): Promise<IUser | null> {
    await DBInstance.getConnection();
    const user = await this.getById(id);
    if (!user) {
      return null;
    }
    Object.assign(user, data);
    return await user.save();
  }

  async updateFavorites(id: string, item: string): Promise<IUser | null> {
    await DBInstance.getConnection();

    // Attempt to add the item (if not present)
    let updatedUser = await UserModel.findOneAndUpdate(
      { _id: id, favoritesIds: { $ne: item } },
      { $addToSet: { favoritesIds: item } },
      { new: true }
    );

    if (updatedUser) {
      return updatedUser;
    }

    // If the item was already in favorites, remove it
    updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $pull: { favoritesIds: item } },
      { new: true }
    );

    return updatedUser;
  }

  async deleteById(id: string): Promise<IUser | null> {
    await DBInstance.getConnection();
    return await UserModel.findByIdAndDelete(id);
  }
}

export default UserRepository;
