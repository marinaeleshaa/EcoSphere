export interface IReview {
  userId: string;
  rate: number;
  review: string;
}

export interface IMenuItem {
  title: string;
  subtitle: string;
  price: number;
  avatar?: string;
  availableOnline: boolean;
  itemRating?: IReview[];
}

export interface IShop {
  _id: number;
  name: string;
  location: string;
  workingHours: string;
  phoneNumber: string;
  avatar: string;
  description: string;
  menus?: IMenuItem[];
  restaurantRating?: IReview[];
}
