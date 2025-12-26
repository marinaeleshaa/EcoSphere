import { IAddress, IRecycle, IRecycleItem } from "./recycle.model";

export type RecycleRequest = Partial<IRecycle>;

export type RecycleResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: IAddress;
  recycleItems: IRecycleItem[];
  userId?: string;
  isVerified?: boolean;
  totalCarbonSaved?: number;
  status?: RecycleOrderStatus;
  createdAt: string;
  updatedAt: string;
};

export interface RecycleRowData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  neighborhood: string;
  street: string;
  building: string;
  floor: number;
  apartment: number;
  items: { type: string; estimatedWeight: number }[];
  userId?: string;
  totalCarbonSaved: number;
  isVerified: boolean;
}

export const mapToRecycleItems = (
  args: { type: string; estimatedWeight: number }[],
) =>
  args.map((item) => ({
    itemType: item.type,
    weight: +item.estimatedWeight,
  }));

export const RecycleOrderStatus = {
  PENDING: "pending",
  REVIEW: "review",
  REJECTED: "rejected",
  PROCESSING: "processing",
  COMPLETED: "completed",
} as const;

export type RecycleOrderStatus =
  (typeof RecycleOrderStatus)[keyof typeof RecycleOrderStatus];

export const mapFromRawDataToRecyeleRequest = (
  data: RecycleRowData,
): RecycleRequest => {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phoneNumber: data.phone,
    address: {
      city: data.city,
      neighborhood: data.neighborhood,
      street: data.street,
      buildingNumber: data.building,
      floor: +data.floor,
      apartmentNumber: +data.apartment,
    },
    recycleItems: mapToRecycleItems(data.items),
    userId: data.userId,
    isVerified: data.isVerified,
    totalCarbonSaved: data.totalCarbonSaved,
  };
};

export const mapRecycleToResponse = (data: IRecycle): RecycleResponse => {
  return {
    id: `${data._id}`,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    address: data.address,
    recycleItems: data.recycleItems,
    userId: data.userId,
    isVerified: data.isVerified,
    totalCarbonSaved: data.totalCarbonSaved,
    status: data.status,
    createdAt: `${data.createdAt}`,
    updatedAt: `${data.updatedAt}`,
  };
};
