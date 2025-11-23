import { injectable } from "tsyringe";
import { Gender, IUser, UserModel } from "../user/user.model";
import { DBInstance } from "@/backend/config/dbConnect";
import { ObjectId } from "mongoose";
import { RegisterRequestDTO } from "./dto/user.dto";
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
  saveNewUser(data: RegisterRequestDTO): Promise<IUser>;
  findUserByEmail(email: string): Promise<IUser | null>;
  findShopByEmail(email: string): Promise<IRestaurant>;
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

  async saveNewUser(data: RegisterRequestDTO): Promise<IUser> {
    const savedUser = await UserModel.create(data);
    return savedUser;
  }

  async findUserByEmail(email: string): Promise<Partial<IUser> | null> {
    await DBInstance.getConnection();

    console.log({ email });
    return await UserModel.findOne({ email }).select("+password").exec();
  }

  async findShopByEmail(email: string): Promise<IRestaurant> {
    await DBInstance.getConnection();

    return await RestaurantModel.findOne({ email }).select("+password").exec();
  }
}

export default AuthRepository;
