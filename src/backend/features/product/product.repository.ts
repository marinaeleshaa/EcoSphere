import { injectable } from "tsyringe";
import { DBInstance } from "@/backend/config/dbConnect";
import { RestaurantModel, IRestaurant } from "../restaurant/restaurant.model";
import { buildProductsPipeline } from "./dto/product.dto";
import mongoose from "mongoose";
import {
  ProductResponse,
  CreateProductDTO,
  UpdateProductDTO,
  PaginatedProductResponse,
  ProductPageOptions,
} from "./dto/product.dto";
import { PipelineStage } from "mongoose";

export interface IProductRepository {
  findAllProducts(
    options?: ProductPageOptions,
  ): Promise<PaginatedProductResponse>;
  findProductById(productId: string): Promise<ProductResponse | null>;
  findProductsByRestaurantId(
    restaurantId: string,
    options?: ProductPageOptions,
  ): Promise<PaginatedProductResponse | ProductResponse[]>;
  addProduct(
    restaurantId: string,
    productData: CreateProductDTO,
  ): Promise<IRestaurant | null>;
  updateProduct(
    restaurantId: string,
    productId: string,
    productData: UpdateProductDTO,
  ): Promise<IRestaurant | null>;
  deleteProduct(
    restaurantId: string,
    productId: string,
  ): Promise<IRestaurant | null>;
  addProductReview(productId: string, review: any): Promise<IRestaurant | null>;
}

@injectable()
export class ProductRepository implements IProductRepository {
  async findAllProducts(
    options?: ProductPageOptions,
  ): Promise<PaginatedProductResponse> {
    await DBInstance.getConnection();

    const pipeline = buildProductsPipeline(options ?? {});
    const result = await RestaurantModel.aggregate(pipeline).exec();

    const data = result[0]?.data ?? [];
    const total = result[0]?.metadata[0]?.total ?? 0;

    return {
      data,
      metadata: {
        total,
        page: options?.page ?? 1,
        limit: options?.limit ?? 10,
        totalPages: Math.ceil(total / (options?.limit ?? 10)),
      },
    };
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
          sustainabilityScore: "$menus.sustainabilityScore",
          sustainabilityReason: "$menus.sustainabilityReason",
          itemRating: "$menus.itemRating",
          category: "$menus.category",
        },
      },
    ]).exec();

    return result[0] || null;
  }

  async findProductsByRestaurantId(
    restaurantId: string,
    options?: ProductPageOptions,
  ): Promise<PaginatedProductResponse> {
    await DBInstance.getConnection();

    const pipeline = buildProductsPipeline({
      ...options,
      restaurantId,
    });

    const result = await RestaurantModel.aggregate(pipeline).exec();

    const data = result[0]?.data ?? [];
    const total = result[0]?.metadata[0]?.total ?? 0;

    return {
      data,
      metadata: {
        total,
        page: options?.page ?? 1,
        limit: options?.limit ?? 10,
        totalPages: Math.ceil(total / (options?.limit ?? 10)),
      },
    };
  }

  async addProduct(
    restaurantId: string,
    productData: CreateProductDTO,
  ): Promise<IRestaurant | null> {
    await DBInstance.getConnection();
    return await RestaurantModel.findByIdAndUpdate(
      restaurantId,
      {
        $push: { menus: productData },
      },
      { new: true, runValidators: true },
    ).exec();
  }

  async updateProduct(
    restaurantId: string,
    productId: string,
    productData: UpdateProductDTO,
  ): Promise<IRestaurant | null> {
    await DBInstance.getConnection();

    const updateQuery: Record<string, any> = {};
    for (const [key, value] of Object.entries(productData)) {
      updateQuery[`menus.$.${key}`] = value;
    }

    return await RestaurantModel.findOneAndUpdate(
      { _id: restaurantId, "menus._id": productId },
      { $set: updateQuery },
      { new: true },
    ).exec();
  }

  async deleteProduct(
    restaurantId: string,
    productId: string,
  ): Promise<IRestaurant | null> {
    await DBInstance.getConnection();
    return await RestaurantModel.findByIdAndUpdate(
      restaurantId,
      {
        $pull: { menus: { _id: productId } },
      },
      { new: true },
    ).exec();
  }

  async addProductReview(
    productId: string,
    review: any,
  ): Promise<IRestaurant | null> {
    await DBInstance.getConnection();
    return await RestaurantModel.findOneAndUpdate(
      { "menus._id": productId },
      {
        $push: { "menus.$.itemRating": review },
      },
      { new: true },
    ).exec();
  }
}
