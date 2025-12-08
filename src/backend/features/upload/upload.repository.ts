import { IUser, UserModel } from "../user/user.model";
import { IRestaurant, RestaurantModel } from "../restaurant/restaurant.model";
import { injectable } from "tsyringe";
import { DBInstance } from "@/backend/config/dbConnect";

export interface IUploadRepository {
	findUserById(id: string): Promise<IUser>;
	findRestaurantById(id: string): Promise<IRestaurant>;
	updateUserAvatar(id: string, key: string): Promise<IUser>;
	updateRestaurantAvatar(id: string, key: string): Promise<IRestaurant>;
	clearUserAvatar(id: string): Promise<IUser>;
	clearRestaurantAvatar(id: string): Promise<IRestaurant>;
}

@injectable()
export class UploadRepository {
	async findUserById(id: string) {
		await DBInstance.getConnection();
		return await UserModel.findById(id);
	}

	async findRestaurantById(id: string) {
		await DBInstance.getConnection();
		return await RestaurantModel.findById(id);
	}

	async updateUserAvatar(id: string, key: string) {
		await DBInstance.getConnection();
		return await UserModel.findByIdAndUpdate(
			id,
			{ avatar: { key } },
			{ new: true }
		);
	}

	async updateRestaurantAvatar(id: string, key: string) {
		await DBInstance.getConnection();
		return await RestaurantModel.findByIdAndUpdate(
			id,
			{ avatar: { key } },
			{ new: true }
		);
	}

	async clearUserAvatar(id: string) {
		await DBInstance.getConnection();
		return await UserModel.findByIdAndUpdate(
			id,
			{ $unset: { avatar: 1 } },
			{ new: true }
		);
	}

	async clearRestaurantAvatar(id: string) {
		await DBInstance.getConnection();
		return await RestaurantModel.findByIdAndUpdate(
			id,
			{ $unset: { avatar: 1 } },
			{ new: true }
		);
	}
}
