import { IRestaurant } from "../restaurant.model";
import { IShop } from "@/types/ShopTypes";

export type RestaurantResponse = IRestaurant;

export const mapResponseToIShop = (res: RestaurantResponse): IShop => {
  return {
    _id: `${res._id}`,
    name: res.name,
    location: res.location,
    workingHours: res.workingHours,
    phoneNumber: res.phoneNumber,
    avatar: {
      key: res.avatar?.key || "",
      url: res.avatar?.url,
    },
    description: res.description,
    // Map menus to IProduct format
    menus: res.menus
      ? res.menus.map((menu) => ({
          id: `${menu._id}`,
          restaurantId: `${res._id}`,
          shopName: res.name,
          shopSubtitle: "", // Not available in menu item
          productImg: menu.avatar?.url || "",
          productName: menu.title,
          productPrice: menu.price,
          productSubtitle: menu.subtitle,
          productDescription: "", // Not available in menu item
          availableOnline: menu.availableOnline ?? true,
          sustainabilityScore: menu.sustainabilityScore,
          sustainabilityReason: menu.sustainabilityReason,
        }))
      : [],
    restaurantRating: res.restaurantRating
      ? JSON.parse(JSON.stringify(res.restaurantRating))
      : [],
  };
};

export interface CreateRestaurantDTO {
  name: string;
  email: string;
  password: string;
  location: string;
  workingHours: string;
  phoneNumber: string;
  description: string;
  avatar?: {
    key: string;
    url?: string;
  };
}

export interface UpdateRestaurantDTO extends Partial<CreateRestaurantDTO> {
  isHidden?: boolean;
  subscribed?: boolean;
  subscriptionPeriod?: Date;
}

export interface RestaurantPageOptions {
  page?: number;
  limit?: number;
  search?: string;
  sort?: "highestRating" | "lowestRating" | "default";
}

export interface PaginatedRestaurantResponse {
  data: IRestaurant[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
