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
};

export const mapRecycleToResponse = (data: IRecycle): RecycleResponse => {
	return {
		...data,
		id: `${data._id}`,
	};
};
