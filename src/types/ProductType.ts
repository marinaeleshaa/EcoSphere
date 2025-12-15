export interface IProduct {
  _id: string;
  restaurantId: string;
  title: string;
  subtitle: string;
  avatar?: {
    url?: string;
    key: string;
  };
  price: number;
  availableOnline?: boolean;
  sustainabilityScore?: number;
  sustainabilityReason?: string;
}

export interface IProductCart extends IProduct {
  quantity: number;
}
