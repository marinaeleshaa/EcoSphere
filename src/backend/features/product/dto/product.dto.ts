import { Types } from "mongoose";
import { IMenuItem } from "../../restaurant/restaurant.model";

// Single unified response type - always includes restaurant context
export type ProductResponse = IMenuItem & {
  restaurantId: Types.ObjectId | string;
  restaurantName: string;
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
