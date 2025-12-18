import { injectable } from "tsyringe";
import { IRestaurant, RestaurantModel } from "./restaurant.model";
import { DBInstance } from "@/backend/config/dbConnect";
import { Types } from "mongoose";

export interface IRestaurantRepository {
  create(
    email: string,
    password: string,
    location: string,
    name: string,
    workingHours: string,
    phoneNumber: string,
    avatar: string,
    description: string,
  ): Promise<IRestaurant>;
  getAll(): Promise<IRestaurant[]>;
  getById(id: string): Promise<IRestaurant>;
  getRestaurantsByIdes(restaurantIds: string[]): Promise<IRestaurant[]>;
  // Find a restaurant by its Stripe customer id (used by subscription flow)
  getRestaurantByStripeId(
    stripeCustomerId: string,
  ): Promise<IRestaurant | null>;
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
    description: string,
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

  async getRestaurantsByIdes(restaurantIds: string[]): Promise<IRestaurant[]> {
    const validIds = restaurantIds.filter((id) => Types.ObjectId.isValid(id));

    if (validIds.length === 0) {
      return [];
    }

    return RestaurantModel.find({
      _id: { $in: validIds },
    })
      .select("name menus")
      .lean<IRestaurant[]>()
      .exec();
  }

  // New helper: find restaurant by Stripe customer id so subscription webhooks
  // and checkout session metadata can be mapped back to a restaurant account.
  async getRestaurantByStripeId(
    stripeCustomerId: string,
  ): Promise<IRestaurant | null> {
    await DBInstance.getConnection();
    const restaurant = await RestaurantModel.findOne({
      stripeCustomerId,
    }).exec();
    return restaurant || null;
  }

  async updateById(
    id: string,
    data: Partial<IRestaurant>,
  ): Promise<IRestaurant> {
    await DBInstance.getConnection();
    const restaurant = await this.getById(id);
    if (!restaurant) {
      throw new Error(`Restaurant with id ${id} not found`);
    }
    Object.assign(restaurant, data);
    const saved = await restaurant.save();
    return saved;
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
