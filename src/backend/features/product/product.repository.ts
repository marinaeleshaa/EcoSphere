import { injectable } from "tsyringe";
import { DBInstance } from "@/backend/config/dbConnect";
import { RestaurantModel, IRestaurant } from "../restaurant/restaurant.model";
import mongoose from "mongoose";
import {
  ProductResponse,
  CreateProductDTO,
  UpdateProductDTO,
} from "./dto/product.dto";

export interface IProductRepository {
  findAllProducts(): Promise<ProductResponse[]>;
  findProductById(productId: string): Promise<ProductResponse | null>;
  findProductsByRestaurantId(restaurantId: string): Promise<ProductResponse[]>;
  addProduct(
    restaurantId: string,
    productData: CreateProductDTO
  ): Promise<IRestaurant | null>;
  updateProduct(
    restaurantId: string,
    productId: string,
    productData: UpdateProductDTO
  ): Promise<IRestaurant | null>;
  deleteProduct(
    restaurantId: string,
    productId: string
  ): Promise<IRestaurant | null>;
}

@injectable()
export class ProductRepository implements IProductRepository {
  async findAllProducts(): Promise<ProductResponse[]> {
    await DBInstance.getConnection();
    return await RestaurantModel.aggregate<ProductResponse>([
      { $unwind: "$menus" },
      {
        $project: {
          _id: "$menus._id",
          restaurantId: "$_id",
          restaurantName: "$name",
          title: "$menus.title",
          subtitle: "$menus.subtitle",
          price: "$menus.price",
          avatar: "$menus.avatar",
          availableOnline: "$menus.availableOnline",
          itemRating: "$menus.itemRating",
        },
      },
    ]).exec();
  }

  async findProductById(productId: string): Promise<ProductResponse | null> {
    await DBInstance.getConnection();
    const result = await RestaurantModel.aggregate<ProductResponse>([
      { $unwind: "$menus" },
      { $match: { "menus._id": new mongoose.Types.ObjectId(productId) } },
      {
        $project: {
          _id: "$menus._id",
          restaurantId: "$_id",
          restaurantName: "$name",
          title: "$menus.title",
          subtitle: "$menus.subtitle",
          price: "$menus.price",
          avatar: "$menus.avatar",
          availableOnline: "$menus.availableOnline",
          itemRating: "$menus.itemRating",
        },
      },
    ]).exec();

    return result[0] || null;
  }

  async findProductsByRestaurantId(
    restaurantId: string
  ): Promise<ProductResponse[]> {
    await DBInstance.getConnection();
    return await RestaurantModel.aggregate<ProductResponse>([
      { $match: { _id: new mongoose.Types.ObjectId(restaurantId) } },
      { $unwind: "$menus" },
      {
        $project: {
          _id: "$menus._id",
          restaurantId: "$_id",
          restaurantName: "$name",
          title: "$menus.title",
          subtitle: "$menus.subtitle",
          price: "$menus.price",
          avatar: "$menus.avatar",
          availableOnline: "$menus.availableOnline",
          itemRating: "$menus.itemRating",
        },
      },
    ]).exec();
  }

  async addProduct(
    restaurantId: string,
    productData: CreateProductDTO
  ): Promise<IRestaurant | null> {
    await DBInstance.getConnection();
    return await RestaurantModel.findByIdAndUpdate(
      restaurantId,
      {
        $push: { menus: productData },
      },
      { new: true, runValidators: true }
    ).exec();
  }

  async updateProduct(
    restaurantId: string,
    productId: string,
    productData: UpdateProductDTO
  ): Promise<IRestaurant | null> {
    await DBInstance.getConnection();

    const updateQuery: Record<string, any> = {};
    for (const [key, value] of Object.entries(productData)) {
      updateQuery[`menus.$.${key}`] = value;
    }

    return await RestaurantModel.findOneAndUpdate(
      { _id: restaurantId, "menus._id": productId },
      { $set: updateQuery },
      { new: true }
    ).exec();
  }

  async deleteProduct(
    restaurantId: string,
    productId: string
  ): Promise<IRestaurant | null> {
    await DBInstance.getConnection();
    return await RestaurantModel.findByIdAndUpdate(
      restaurantId,
      {
        $pull: { menus: { _id: productId } },
      },
      { new: true }
    ).exec();
  }
}
