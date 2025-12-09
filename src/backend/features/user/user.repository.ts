import { injectable } from "tsyringe";
import { IUser, UserModel } from "./user.model";
import { DBInstance } from "@/backend/config/dbConnect";

export interface IUserRepository {
  getAll(): Promise<IUser[]>;
  getById(id: string): Promise<IUser>;
  getUserIdByEmail(email: string): Promise<IUser>;
  updateById(id: string, data: Partial<IUser>): Promise<IUser>;
  updateFavorites(id: string, data: string): Promise<IUser>;
  deleteById(id: string): Promise<IUser>;
}

@injectable()
class UserRepository {
  async getAll(): Promise<IUser[]> {
    await DBInstance.getConnection();
    return await UserModel.find({}, { password: 0 });
  }

  async getById(id: string): Promise<IUser> {
    await DBInstance.getConnection();
    const user = await UserModel.findById(id, { password: 0 });

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    return user;
  }
  async getUserIdByEmail(email: string): Promise<IUser> {
    return await UserModel.findOne({ email }).select("_id").exec()
  }
  async updateById(id: string, data: Partial<IUser>): Promise<IUser> {
    await DBInstance.getConnection();
    const user = await this.getById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    Object.assign(user, data);
    return await user.save();
  }

  async updateFavorites(id: string, item: string): Promise<IUser> {
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

  async deleteById(id: string): Promise<IUser> {
    await DBInstance.getConnection();
    const user = await this.getById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return await user.deleteOne();
  }
}

export default UserRepository;
