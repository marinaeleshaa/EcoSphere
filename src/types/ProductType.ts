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
  availableOnline: boolean;
}

export interface IProductCart extends IProduct {
  quantity: number;
}
