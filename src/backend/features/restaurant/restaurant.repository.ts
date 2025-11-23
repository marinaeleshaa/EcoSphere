import { injectable } from "tsyringe";
import { IRestaurant, RestaurantModel } from "./restaurant.model";
import { DBInstance } from "@/backend/config/dbConnect";

export interface IRestaurantRepository {
  create(
    email: string,
    password: string,
    location: string,
    name: string,
    workingHours: string,
    phoneNumber: string,
    avatar: string,
    description: string
  ): Promise<IRestaurant>;
  getAll(): Promise<IRestaurant[]>;
  getById(id: string): Promise<IRestaurant | null>;
  updateById(
    id: string,
    data: Partial<IRestaurant>
  ): Promise<IRestaurant | null>;
  updateFavoritedBy(
    userId: string,
    restaurantId: string
  ): Promise<IRestaurant | null>;
  deleteById(id: string): Promise<IRestaurant | null>;
}

@injectable()
class RestaurantRepository {
  async create(
    email: string,
    password: string,
    location: string,
    name: string,
    workingHours: string,
    phoneNumber: string,
    avatar: string,
    description: string
  ): Promise<IRestaurant> {
    await DBInstance.getConnection();
    return await RestaurantModel.create({
      email,
      password,
      location,
      name,
      workingHours,
      phoneNumber,
      avatar,
      description,
    });
  }

  async getAll(): Promise<IRestaurant[]> {
    await DBInstance.getConnection();
    return await RestaurantModel.find({}, { password: 0 });
  }

  async getById(id: string): Promise<IRestaurant | null> {
    await DBInstance.getConnection();
    return await RestaurantModel.findById(id, { password: 0 });
  }

  async updateById(
    id: string,
    data: Partial<IRestaurant>
  ): Promise<IRestaurant | null> {
    await DBInstance.getConnection();
    const restaurant = await this.getById(id);
    if (!restaurant) {
      return null;
    }
    Object.assign(restaurant, data);
    return await restaurant.save();
  }

  async deleteById(id: string): Promise<IRestaurant | null> {
    await DBInstance.getConnection();
    return await RestaurantModel.findByIdAndDelete(id);
  }
}

export default RestaurantRepository;
