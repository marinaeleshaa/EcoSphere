export interface IProduct {
  _id: string;
  title: string;
  subtitle: string;
  price: number;
  avatar?: {
    key: string;
    url?: string;
  };
  availableOnline: boolean;
}