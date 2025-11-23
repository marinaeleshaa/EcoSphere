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
  getById(id: string): Promise<IRestaurant>;
  updateById(id: string, data: Partial<IRestaurant>): Promise<IRestaurant>;
  updateFavoritedBy(userId: string, restaurantId: string): Promise<IRestaurant>;
  deleteById(id: string): Promise<IRestaurant>;
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

  async getById(id: string): Promise<IRestaurant> {
    await DBInstance.getConnection();
    const restaurant = await RestaurantModel.findById(id, { password: 0 });
    if (!restaurant) {
      throw new Error(`Restaurant with id ${id} not found`);
    }
    return restaurant;
  }

  async updateById(
    id: string,
    data: Partial<IRestaurant>
  ): Promise<IRestaurant> {
    await DBInstance.getConnection();
    const restaurant = await this.getById(id);
    if (!restaurant) {
      throw new Error(`Restaurant with id ${id} not found`);
    }
    Object.assign(restaurant, data);
    return await restaurant.save();
  }

  async deleteById(id: string): Promise<IRestaurant> {
    await DBInstance.getConnection();
    const restaurant = await this.getById(id);
    if (!restaurant) {
      throw new Error(`Restaurant with id ${id} not found`);
    }
    return await restaurant.deleteOne();
  }
}

export default RestaurantRepository;
