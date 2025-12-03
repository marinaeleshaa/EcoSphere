import { injectable } from "tsyringe";
import { IUser, UserModel } from "../user/user.model";
import { DBInstance } from "@/backend/config/dbConnect";
import { ObjectId } from "mongoose";
import { FoundedUser, RegisterRequestDTO, ShopRegisterDTO } from "./dto/user.dto";
import { IRestaurant, RestaurantModel } from "../restaurant/restaurant.model";

export interface IAuthRepository {
  existsByEmail(email: string): Promise<{ _id: ObjectId } | null>;
  existsShopByEmail(email: string): Promise<{ _id: ObjectId }>;
  saveNewUser(data: RegisterRequestDTO): Promise<IUser>;
  saveNewShop(data: ShopRegisterDTO): Promise<IRestaurant>;
  findUserByEmail(email: string, keys?: string): Promise<FoundedUser>;
  findShopByEmail(email: string, keys?: string): Promise<FoundedUser>;
  me(): Promise<IUser>;
}

@injectable()
class AuthRepository {
  async existsByEmail(email: string) {
    await DBInstance.getConnection();
    return await UserModel.exists({ email }).lean().exec();
  }
  
  async existsShopByEmail(email: string) {
    await DBInstance.getConnection();
    return await RestaurantModel.exists({ email }).lean().exec();
  }

  async saveNewUser(data: RegisterRequestDTO): Promise<IUser> {
    await DBInstance.getConnection();
    return await UserModel.create(data);
  }

  async saveNewShop(data: ShopRegisterDTO): Promise<IRestaurant> {
    await DBInstance.getConnection();
    const shopData: any = { ...data };
    if (data.avatar) {
      shopData.avatar = { key: data.avatar };
    }
    return await RestaurantModel.create(shopData);
  }

  async findUserByEmail(email: string, keys?: string): Promise<FoundedUser> {
    await DBInstance.getConnection();
    return await UserModel.findOne({ email })
      .select(`+password _id email role lastName accountProvider ${keys || ""}`)
      .exec();
  }

  async findShopByEmail(email: string, keys?: string): Promise<FoundedUser> {
    await DBInstance.getConnection();
    return await RestaurantModel.findOne({ email })
      .select(`+password _id email name ${keys || ""}`)
      .exec();
  }

  async me(): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
}

export default AuthRepository;
