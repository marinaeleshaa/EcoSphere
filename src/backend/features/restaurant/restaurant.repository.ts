import { injectable } from "tsyringe";
import { IRestaurant, RestaurantModel } from "./restaurant.model";
import {
  RestaurantPageOptions,
  PaginatedRestaurantResponse,
} from "./dto/restaurant.dto";
import { DBInstance } from "@/backend/config/dbConnect";
import { Types, PipelineStage } from "mongoose";

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
  getAll(
    options?: RestaurantPageOptions
  ): Promise<PaginatedRestaurantResponse | IRestaurant[]>;
  getById(id: string): Promise<IRestaurant>;
  getRestaurantsByIdes(restaurantIds: string[]): Promise<IRestaurant[]>;
  getFirstRestaurants(limit?: number): Promise<IRestaurant[]>;
  // Find a restaurant by its Stripe customer id (used by subscription flow)
  getRestaurantByStripeId(
    stripeCustomerId: string
  ): Promise<IRestaurant | null>;
  updateById(id: string, data: Partial<IRestaurant>): Promise<IRestaurant>;
  updateFavoritedBy(userId: string, restaurantId: string): Promise<IRestaurant>;
  deleteById(id: string): Promise<IRestaurant>;
  // Category filtering methods for AI chatbot
  getRestaurantsByCategory(
    category: string,
    limit?: number
  ): Promise<IRestaurant[]>;
  getRestaurantCategoryCounts(): Promise<{ category: string; count: number }[]>;
  // Analytics methods for AI chatbot
  getTopRestaurantsByRating(limit?: number): Promise<IRestaurant[]>;
  getTotalRestaurantCount(): Promise<number>;
  getRestaurantsWithMostProducts(limit?: number): Promise<any[]>;
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

  async getAll(
    options: RestaurantPageOptions = {}
  ): Promise<PaginatedRestaurantResponse> {
    await DBInstance.getConnection();

    const {
      page = 1,
      limit = 10,
      search = "",
      sort = "default",
      category = "default",
      status = "visible",
    } = options;

    const skip = (page - 1) * limit;

    const matchStage: any = {};

    if (status === "visible") {
      matchStage.isHidden = false;
    } else if (status === "hidden") {
      matchStage.isHidden = true;
    }
    // If status is "all", we don't add isHidden to matchStage

    if (search) {
      const regex = new RegExp(search, "i");
      matchStage.$or = [{ name: regex }, { description: regex }];
    }

    if (category && category !== "default") {
      matchStage.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    const pipeline: any[] = [
      { $match: matchStage },
      {
        $addFields: {
          restaurantRatingAvg: {
            $cond: [
              { $gt: [{ $size: "$restaurantRating" }, 0] },
              { $avg: "$restaurantRating.rate" },
              0,
            ],
          },
        },
      },
    ];

    if (sort === "highestRating") {
      pipeline.push({ $sort: { restaurantRatingAvg: -1 } });
    } else if (sort === "lowestRating") {
      pipeline.push({ $sort: { restaurantRatingAvg: 1 } });
    } else {
      pipeline.push({ $sort: { name: 1 } });
    }

    pipeline.push({
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        metadata: [{ $count: "total" }],
      },
    });

    const result = await RestaurantModel.aggregate(pipeline).exec();

    const data = result[0]?.data || [];
    const total = result[0]?.metadata[0]?.total || 0;

    return {
      data,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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

  async getFirstRestaurants(limit: number = 15): Promise<IRestaurant[]> {
    await DBInstance.getConnection();

    // Simply get the first N non-hidden restaurants
    const restaurants = await RestaurantModel.find({ isHidden: false })
      .select("_id name avatar")
      .limit(limit)
      .lean<IRestaurant[]>()
      .exec();

    return restaurants;
  }

  // New helper: find restaurant by Stripe customer id so subscription webhooks
  // and checkout session metadata can be mapped back to a restaurant account.
  async getRestaurantByStripeId(
    stripeCustomerId: string
  ): Promise<IRestaurant | null> {
    await DBInstance.getConnection();
    const restaurant = await RestaurantModel.findOne({
      stripeCustomerId,
    }).exec();
    return restaurant || null;
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

  // Category filtering methods for AI chatbot
  async getRestaurantsByCategory(
    category: string,
    limit: number = 10
  ): Promise<IRestaurant[]> {
    await DBInstance.getConnection();

    // Use aggregation to calculate average rating and sort by it
    const pipeline: PipelineStage[] = [
      {
        $match: {
          category,
          isHidden: false,
        },
      },
      {
        $addFields: {
          avgRating: {
            $cond: [
              { $gt: [{ $size: { $ifNull: ["$restaurantRating", []] } }, 0] },
              { $avg: "$restaurantRating.rate" },
              0,
            ],
          },
        },
      },
      { $sort: { avgRating: -1 } }, // Sort by highest rating first
      { $limit: limit },
      {
        $project: {
          name: 1,
          location: 1,
          category: 1,
          description: 1,
          restaurantRating: 1,
          workingHours: 1,
          phoneNumber: 1,
          avatar: 1,
          avgRating: 1,
        },
      },
    ];

    const results = await RestaurantModel.aggregate(pipeline).exec();
    return results as IRestaurant[];
  }

  async getRestaurantCategoryCounts(): Promise<
    { category: string; count: number }[]
  > {
    await DBInstance.getConnection();

    const result = await RestaurantModel.aggregate([
      { $match: { isHidden: false } },
      {
        $group: {
          _id: "$category",
          count: { $count: {} },
        },
      },
      {
        $project: {
          category: "$_id",
          count: 1,
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]).exec();

    return result;
  }

  // Analytics methods for AI chatbot
  async getTopRestaurantsByRating(limit: number = 10): Promise<IRestaurant[]> {
    await DBInstance.getConnection();

    const pipeline: PipelineStage[] = [
      { $match: { isHidden: false } },
      {
        $addFields: {
          avgRating: {
            $cond: [
              { $gt: [{ $size: { $ifNull: ["$restaurantRating", []] } }, 0] },
              { $avg: "$restaurantRating.rate" },
              0,
            ],
          },
        },
      },
      { $match: { avgRating: { $gt: 0 } } }, // Only restaurants with ratings
      { $sort: { avgRating: -1 } },
      { $limit: limit },
    ];

    return await RestaurantModel.aggregate(pipeline).exec();
  }

  async getTotalRestaurantCount(): Promise<number> {
    await DBInstance.getConnection();

    return await RestaurantModel.countDocuments({ isHidden: false }).exec();
  }

  async getRestaurantsWithMostProducts(limit: number = 10): Promise<any[]> {
    await DBInstance.getConnection();

    const pipeline: PipelineStage[] = [
      { $match: { isHidden: false } },
      {
        $addFields: {
          productCount: { $size: { $ifNull: ["$menus", []] } },
        },
      },
      { $sort: { productCount: -1 } },
      { $limit: limit },
      {
        $project: {
          name: 1,
          productCount: 1,
          location: 1,
          category: 1,
        },
      },
    ];

    return await RestaurantModel.aggregate(pipeline).exec();
  }
}

export default RestaurantRepository;
