export interface ProductContextDTO {
  title: string;
  price: number;
  description: string;
  rating: number;
  availableOnline: boolean;
  soldBy: string;
}

export interface MenuItemDTO {
  title: string;
  price: number;
}

export interface RestaurantContextDTO {
  name: string;
  description: string;
  location: string;
  workingHours: string;
  menu: MenuItemDTO[];
}

export interface GeneralContextDTO {
  systemName: string;
  goal: string;
  features: string[];
}
