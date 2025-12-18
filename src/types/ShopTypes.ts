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

export interface IShop {
  _id: string;
  name: string;
  location: string;
  workingHours: string;
  phoneNumber: string;
  avatar: IShopAvatar;
  description: string;
  menus?: IProduct[];
  restaurantRating?: IReview[];
}
