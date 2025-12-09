import { injectable } from "tsyringe";
import { IUser, UserModel } from "../user/user.model";
import { DBInstance } from "@/backend/config/dbConnect";
import { ObjectId } from "mongoose";
import { RegisterRequestDTO, ShopRegisterDTO } from "./dto/user.dto";
import { IRestaurant, RestaurantModel } from "../restaurant/restaurant.model";

export interface IAuthRepository {
  existsByEmail(email: string): Promise<{ _id: ObjectId } | null>;
  existsShopByEmail(email: string): Promise<{ _id: ObjectId }>;
  saveNewUser(data: RegisterRequestDTO): Promise<IUser>;
  saveNewShop(data: ShopRegisterDTO): Promise<IRestaurant>;
  findUserByEmail(email: string, keys?: string): Promise<IUser>;
  findShopByEmail(email: string, keys?: string): Promise<IRestaurant>;
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
    return await RestaurantModel.create(data);
  }

  async findUserByEmail(email: string, keys?: string): Promise<IUser> {
    await DBInstance.getConnection();
    return await UserModel.findOne({ email })
      .select(
        `password _id email role lastName accountProvider avatar ${
          keys || ""
        }`
      )
      .exec();
  }

  async findShopByEmail(email: string, keys?: string): Promise<IRestaurant> {
    await DBInstance.getConnection();
    return await RestaurantModel.findOne({ email })
      .select(`password _id email name avatar ${keys || ""}`)
      .exec();
  }

  async me(): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
}

export default AuthRepository;
