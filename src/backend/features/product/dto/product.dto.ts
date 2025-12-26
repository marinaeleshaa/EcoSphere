import { Types, PipelineStage } from "mongoose";
import { IMenuItem, MenuItemCategory } from "../../restaurant/restaurant.model";
import { IProduct } from "@/types/ProductType";

// Single unified response type - always includes restaurant context
export type ProductResponse = IMenuItem & {
  restaurantId: Types.ObjectId | string;
  restaurantName: string;
};

export const mapResponseToIProduct = (res: ProductResponse): IProduct => {
  const productImg = res.avatar?.url || "";

  return {
    id: `${res._id}`,
    restaurantId: `${res.restaurantId}`,
    shopName: res.restaurantName,
    shopSubtitle: res.subtitle,
    productImg,
    productName: res.title,
    productPrice: res.price,
    productSubtitle: res.subtitle,
    productDescription: "",
    availableOnline: res.availableOnline,
    sustainabilityScore: res.sustainabilityScore || 0,
    sustainabilityReason: res.sustainabilityReason,
    category: res.category,
    quantity: res.quantity,
    inStock: res.inStock,
  };
};

export interface CreateProductDTO {
  title: string;
  subtitle: string;
  price: number;
  category: MenuItemCategory;
  quantity?: number; // Optional - defaults to 1 in schema
  avatar?: {
    key: string;
    url?: string;
  };
  availableOnline?: boolean; // Optional - defaults to true in schema
  sustainabilityScore?: number;
  sustainabilityReason?: string;
}

export type UpdateProductDTO = Partial<CreateProductDTO>;

export interface ProductPageOptions {
  page?: number;
  limit?: number;
  search?: string;
  sort?:
    | "default"
    | "priceLow"
    | "priceHigh"
    | "sustainabilityLow"
    | "sustainabilityHigh";
  category?: string;
}

export interface PaginatedProductResponse {
  data: ProductResponse[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function buildProductsPipeline({
  restaurantId,
  page = 1,
  limit = 10,
  search = "",
  category = "default",
  sort = "default",
}: {
  restaurantId?: string;
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
}): PipelineStage[] {
  const skip = (page - 1) * limit;

  const pipeline: PipelineStage[] = [];

  // 🔹 Base match
  const baseMatch: any = { isHidden: false };

  if (restaurantId) {
    baseMatch._id = new Types.ObjectId(restaurantId);
  }

  pipeline.push({ $match: baseMatch });

  // 🔹 Unwind menus
  pipeline.push({ $unwind: "$menus" });

  // 🔹 Project
  pipeline.push({
    $project: {
      _id: "$menus._id",
      restaurantId: "$_id",
      restaurantName: "$name",
      title: "$menus.title",
      subtitle: "$menus.subtitle",
      price: "$menus.price",
      category: "$menus.category",
      avatar: "$menus.avatar",
      availableOnline: "$menus.availableOnline",
      sustainabilityScore: "$menus.sustainabilityScore",
      sustainabilityReason: "$menus.sustainabilityReason",
      itemRating: "$menus.itemRating",
    },
  });

  pipeline.push({
    $group: {
      _id: "$_id", // menu item id
      restaurantId: { $first: "$restaurantId" },
      restaurantName: { $first: "$restaurantName" },
      title: { $first: "$title" },
      subtitle: { $first: "$subtitle" },
      price: { $first: "$price" },
      category: { $first: "$category" },
      avatar: { $first: "$avatar" },
      availableOnline: { $first: "$availableOnline" },
      sustainabilityScore: { $first: "$sustainabilityScore" },
      sustainabilityReason: { $first: "$sustainabilityReason" },
      itemRating: { $first: "$itemRating" },
    },
  });

  // 🔹 Search & category filters
  const filters: any[] = [];

  if (search.trim()) {
    filters.push({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { subtitle: { $regex: search, $options: "i" } },
      ],
    });
  }

  if (category !== "default") {
    filters.push({ category });
  }

  if (filters.length) {
    pipeline.push({ $match: { $and: filters } });
  }

  // 🔹 Sorting
  switch (sort) {
    case "priceLow":
      pipeline.push({ $sort: { price: 1, title: 1 } });
      break;
    case "priceHigh":
      pipeline.push({ $sort: { price: -1, title: 1 } });
      break;
    case "sustainabilityLow":
      pipeline.push({ $sort: { sustainabilityScore: 1, title: 1 } });
      break;
    case "sustainabilityHigh":
      pipeline.push({ $sort: { sustainabilityScore: -1, title: 1 } });
      break;
    default:
      pipeline.push({ $sort: { title: 1 } });
  }

  // 🔹 Pagination
  pipeline.push({
    $facet: {
      metadata: [{ $count: "total" }],
      data: [{ $skip: skip }, { $limit: limit }],
    },
  });

  return pipeline;
}
