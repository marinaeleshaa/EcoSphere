import { Types } from "mongoose";
import { IMenuItem } from "../../restaurant/restaurant.model";
import { IProduct } from "@/types/ProductType";

// Single unified response type - always includes restaurant context
export type ProductResponse = IMenuItem & {
  restaurantId: Types.ObjectId | string;
  restaurantName: string;
};

export const mapResponseToIProduct = (res: ProductResponse): IProduct => {
  console.log(
    "[mapResponseToIProduct] Avatar data:",
    JSON.stringify(
      {
        hasAvatar: !!res.avatar,
        avatar: res.avatar,
        avatarKey: res.avatar?.key,
        avatarUrl: res.avatar?.url,
        productId: res._id?.toString(),
        productName: res.title,
      },
      null,
      2
    )
  );

  const productImg = res.avatar?.url || "";
  console.log(
    "[mapResponseToIProduct] Final productImg:",
    productImg || "EMPTY"
  );

  return {
    id: `${res._id}`,
    restaurantId: `${res.restaurantId}`,
    shopName: res.restaurantName,
    shopSubtitle: res.subtitle,
    productImg,
    productName: res.title,
    productPrice: res.price,
    productSubtitle: res.subtitle,
    productDescription: "", // res.description is not available in ProductResponse
    availableOnline: res.availableOnline,
    sustainabilityScore: res.sustainabilityScore,
    sustainabilityReason: res.sustainabilityReason,
    itemRating: res.itemRating
      ? JSON.parse(JSON.stringify(res.itemRating))
      : [],
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
