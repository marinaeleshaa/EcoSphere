import { IProduct } from "./ProductType";

export interface IReview {
  userId: string;
  rate: number;
  review: string;
}

export interface IShopAvatar {
  key: string;
  url?: string;
}

export type SortOption = "default" | "highestRating" | "lowestRating";

export type CategoryOption =
  | "default"
  | "supermarket"
  | "hypermarket"
  | "grocery"
  | "bakery"
  | "cafe"
  | "other";
export type CategoryOptionClient =
  | "supermarket"
  | "hypermarket"
  | "grocery"
  | "bakery"
  | "cafe"
  | "other";

export interface IShop {
  _id: string;
  name: string;
  email: string;
  location: string;
  workingHours: string;
  phoneNumber: string;
  avatar: IShopAvatar;
  description: string;
  menus?: IProduct[];
  restaurantRating?: IReview[];
  category: string;
  isHidden?: boolean;
  subscribed?: boolean;
}
