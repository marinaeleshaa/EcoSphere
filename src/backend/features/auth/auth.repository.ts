import { injectable } from "tsyringe";
import { Gender, IUser, UserModel } from "../user/user.model";
import { DBInstance } from "@/backend/config/dbConnect";
import { ObjectId } from "mongoose";
import { FoundedUser, RegisterRequestDTO } from "./dto/user.dto";
import { IRestaurant, RestaurantModel } from "../restaurant/restaurant.model";

export interface IAuthRepository {
  register(
    email: string,
    name: string,
    password: string,
    birthDate: string,
    address: string,
    avatar: string,
    gender: Gender,
    phoneNumber: string
  ): Promise<IUser>;
  existsByEmail(email: string): Promise<{ _id: ObjectId } | null>;
  existsShopByEmail(email: string): Promise<{ _id: ObjectId }>;
  saveNewUser(data: RegisterRequestDTO): Promise<IUser>;
  saveNewShop(data: RegisterRequestDTO): Promise<IRestaurant>;
  findUserByEmail(email: string, keys?: string): Promise<FoundedUser>;
  findShopByEmail(email: string, keys?: string): Promise<FoundedUser>;
  me(): Promise<IUser[]>;
}

@injectable()
class AuthRepository {
  async register(
    email: string,
    name: string,
    password: string,
    birthDate: string,
    address: string,
    avatar: string,
    gender: Gender,
    phoneNumber: string
  ): Promise<IUser> {
    await DBInstance.getConnection();
    return await UserModel.create({
      email,
      name,
      password,
      birthDate,
      address,
      avatar,
      gender,
      phoneNumber,
    });
  }

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
  async saveNewShop(data: RegisterRequestDTO): Promise<IRestaurant> {
    await DBInstance.getConnection();
    return await RestaurantModel.create(data);
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
		  .select(`+password _id email role lastName accountProvider ${keys || ""}`)
      .exec();
  }
}

export default AuthRepository;
