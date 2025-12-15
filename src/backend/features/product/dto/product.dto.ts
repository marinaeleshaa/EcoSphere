import { Types } from "mongoose";
import { IMenuItem } from "../../restaurant/restaurant.model";
import { IProduct } from "@/types/ProductType";

// Single unified response type - always includes restaurant context
export type ProductResponse = IMenuItem & {
  restaurantId: Types.ObjectId | string;
  restaurantName: string;
};

export const mapResponseToIProduct = (res: ProductResponse): IProduct => {
  return {
    _id: `${res._id}`,
    restaurantId: `${res.restaurantId}`,
    title: res.title,
    subtitle: res.subtitle,
    avatar: res.avatar,
    price: res.price,
    availableOnline: res.availableOnline,
    sustainabilityScore: res.sustainabilityScore,
    sustainabilityReason: res.sustainabilityReason,
  };
};

export interface CreateProductDTO {
  title: string;
  subtitle: string;
  price: number;
  avatar?: {
    key: string;
    url?: string;
  };
  availableOnline?: boolean; // Optional - defaults to true in schema
  sustainabilityScore?: number;
  sustainabilityReason?: string;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}

export interface ProductPageOptions {
  page?: number;
  limit?: number;
  search?: string;
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
