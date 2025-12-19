import { injectable } from "tsyringe";
import { DBInstance } from "@/backend/config/dbConnect";
import { RestaurantModel, IRestaurant } from "../restaurant/restaurant.model";
import mongoose from "mongoose";
import {
  ProductResponse,
  CreateProductDTO,
  UpdateProductDTO,
  PaginatedProductResponse,
  ProductPageOptions,
} from "./dto/product.dto";

export interface IProductRepository {
  findAllProducts(): Promise<ProductResponse[]>;
  findProductById(productId: string): Promise<ProductResponse | null>;
  findProductsByRestaurantId(
    restaurantId: string,
    options?: ProductPageOptions
  ): Promise<PaginatedProductResponse | ProductResponse[]>;
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
  addProductReview(productId: string, review: any): Promise<IRestaurant | null>;
}

@injectable()
export class ProductRepository implements IProductRepository {
  async findAllProducts(): Promise<ProductResponse[]> {
    await DBInstance.getConnection();
    const result = await RestaurantModel.aggregate<ProductResponse>([
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
          sustainabilityScore: "$menus.sustainabilityScore",
          sustainabilityReason: "$menus.sustainabilityReason",
          itemRating: "$menus.itemRating",
        },
      },
    ]).exec();

    console.log(
      "[findAllProducts] Sample product from DB:",
      result.length > 0
        ? JSON.stringify(
            {
              productId: result[0]._id?.toString(),
              productName: result[0].title,
              hasAvatar: !!result[0].avatar,
              avatar: result[0].avatar,
              avatarKey: result[0].avatar?.key,
              avatarUrl: result[0].avatar?.url,
            },
            null,
            2
          )
        : "No products found"
    );

    return result;
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
        },
      },
    ]).exec();

    return result[0] || null;
  }

  async findProductsByRestaurantId(
    restaurantId: string,
    options?: ProductPageOptions
  ): Promise<PaginatedProductResponse | ProductResponse[]> {
    await DBInstance.getConnection();

    // If options are not provided or don't include page/limit, return simple list (legacy behavior)
    if (!options || (!options.page && !options.limit)) {
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
            sustainabilityScore: "$menus.sustainabilityScore",
            sustainabilityReason: "$menus.sustainabilityReason",
            itemRating: "$menus.itemRating",
          },
        },
      ]).exec();
    }

    const { page = 1, limit = 10, search = "" } = options;
    const skip = (page - 1) * limit;

    const pipeline: any[] = [
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
          sustainabilityScore: "$menus.sustainabilityScore",
          sustainabilityReason: "$menus.sustainabilityReason",
          itemRating: "$menus.itemRating",
        },
      },
    ];

    pipeline.push(
      {
        $match: {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { subtitle: { $regex: search, $options: "i" } },
            // Add description if it exists in the schema, though subtitle seems to be the one used for description in this context
          ],
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      }
    );

    // pipeline.push(); // Facet stage added above

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

  async addProductReview(
    productId: string,
    review: any
  ): Promise<IRestaurant | null> {
    await DBInstance.getConnection();
    return await RestaurantModel.findOneAndUpdate(
      { "menus._id": productId },
      {
        $push: { "menus.$.itemRating": review },
      },
      { new: true }
    ).exec();
  }
}
