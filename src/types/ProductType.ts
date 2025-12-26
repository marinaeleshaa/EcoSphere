import { IReview } from "./ShopTypes";

export interface IProduct {
  id: string;
  restaurantId: string;
  shopName: string;
  shopSubtitle: string;
  productImg: string;
  productName: string;
  productPrice: number;
  productSubtitle: string;
  productDescription: string;
  availableOnline?: boolean;
  sustainabilityScore?: number;
  sustainabilityReason?: string;
  itemRating?: IReview[];
  category?: string;
  quantity: number;
  inStock: boolean;
}

export interface IProductCart extends IProduct {
  quantity: number; // Quantity user wants to buy
  maxQuantity: number; // Available stock limit
}
