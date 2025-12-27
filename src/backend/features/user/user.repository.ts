import { injectable } from "tsyringe";
import { ICart, IUser, UserModel, UserRole } from "./user.model";
import { DBInstance } from "@/backend/config/dbConnect";
import { DashboardUsers, PagedData } from "./user.types";
import { ProjectionFields, Types } from "mongoose";
import { IMenuItem, RestaurantModel } from "../restaurant/restaurant.model";
import { ProductResponse } from "../product/dto/product.dto";

export interface IUserRepository {
	getAll(): Promise<IUser[]>;
	getById(id: string, query?: string): Promise<IUser>;
	getFavoriteMenuItems(itemIds: string[]): Promise<ProductResponse[]>;
	getUsersByRoleAdvanced(options?: {
		limit?: number;
		sortBy?: string;
		sortOrder?: 1 | -1;
		selectFields?: string | Record<string, 0 | 1>;
	}): Promise<DashboardUsers>;
	getUsersByRole(
		userType: string,
		limit?: number,
		skip?: number
	): Promise<PagedData<IUser>>;
	redeemPoints(userId: string): Promise<IUser>;
	getUserIdByEmail(email: string): Promise<IUser>;
	getUserByStripeId(stripeCustomerId: string): Promise<IUser | null>;
	saveCart(userId: string, cart: ICart[]): Promise<IUser>;
	updateById(id: string, data: Partial<IUser>): Promise<IUser>;
	updateFavorites(id: string, data: string): Promise<IUser>;
	addToFavorites(id: string, productId: string): Promise<IUser>;
	removeFromFavorites(id: string, productId: string): Promise<IUser>;
	saveFavorites(userId: string, favorites: string[]): Promise<IUser>;
	clearFavorites(userId: string): Promise<IUser>;
	deleteById(id: string): Promise<IUser>;
	savePasswordResetCode(
		userId: string,
		code: string,
		validTo: string
	): Promise<void>;
	changePassword(
		userId: string,
		currentPassword: string,
		newPassword: string
	): Promise<boolean>;
	// Analytics methods for AI chatbot
	getUserCountByRole(role?: string): Promise<number>;
	getRecentUserCount(days?: number): Promise<number>;
	getTopUsersByPoints(limit?: number): Promise<IUser[]>;
}

@injectable()
class UserRepository implements IUserRepository {
	async getAll(): Promise<IUser[]> {
		await DBInstance.getConnection();
		return await UserModel.find({}, { password: 0 }).lean<IUser[]>().exec();
	}

	async getById(
		id: string,
		query: string = "email firstName lastName avatar phoneNumber"
	): Promise<IUser> {
		await DBInstance.getConnection();
		let projection: ProjectionFields<IUser> = {};

		if (!query || query.trim() === "") {
			projection = { password: 0 };
		} else {
			query
				.trim()
				.split(/\s+/)
				.filter((f) => f !== "password")
				.forEach((field) => {
					projection[field] = 1;
				});
		}

		const user = await UserModel.findById(id, projection).exec();

		if (!user) {
			throw new Error(`User with id ${id} not found`);
		}
		return user;
	}

	async getUsersByRole(
		userType: string,
		limit?: number,
		page?: number
	): Promise<PagedData<IUser>> {
		await DBInstance.getConnection();
		const pageSafe = Math.max(page ?? 1, 1);
		const limitSafe = Math.min(limit ?? 10, 100);
		const skipSafe = (pageSafe - 1) * limitSafe;
		const filter = { role: userType };

		const [items, total] = await Promise.all([
			UserModel.find(filter)
				.select("firstName lastName email phoneNumber birthDate role isActive")
				.lean<IUser[]>()
				.sort({ createdAt: -1 })
				.limit(limitSafe)
				.skip(skipSafe)
				.exec(),
			UserModel.countDocuments(filter),
		]);
		return {
			data: items,
			meta: {
				page: pageSafe,
				limit: limitSafe,
				total,
				totalPages: Math.ceil(total / limitSafe),
				hasNextPage: pageSafe * limitSafe < total,
				hasPrevPage: pageSafe > 1,
			},
		};
	}

	async getUsersByRoleAdvanced(options?: {
		limit?: number;
		sortBy?: string;
		sortOrder?: 1 | -1;
		selectFields?: string | Record<string, 0 | 1>;
	}): Promise<DashboardUsers> {
		await DBInstance.getConnection();
		const {
			limit = 5,
			sortBy = "createdAt",
			sortOrder = -1,
			selectFields = "-password -cart -paymentHistory",
		} = options || {};

		const roles: UserRole[] = ["organizer", "admin", "recycleAgent"];
		// Convert selectFields to $project format
		const projectStage = this.parseSelectFields(selectFields);

		const facets = roles.reduce((acc, role) => {
			acc[role] = [
				{ $match: { role } },
				{ $sort: { [sortBy]: sortOrder } },
				{ $limit: limit },
				{ $project: projectStage },
			];
			return acc;
		}, {} as Record<string, any[]>);

		const result = await UserModel.aggregate()
			.match({ role: { $ne: "customer" } })
			.facet(facets)
			.exec();

		return result[0] as DashboardUsers;
	}

	async redeemPoints(userId: string) {
		await DBInstance.getConnection();
		const user = await UserModel.findByIdAndUpdate(
			userId,
			{ $set: { points: 0 } },
			{ new: true }
		)
			.select("email points")
			.lean<IUser>()
			.exec();
		return user!;
	}

	async getUserIdByEmail(email: string): Promise<IUser> {
		await DBInstance.getConnection();
		const response = await UserModel.findOne({ email })
			.select("_id")
			.lean<IUser>()
			.exec();
		return response!;
	}

	async getUserByStripeId(stripeCustomerId: string): Promise<IUser> {
		await DBInstance.getConnection();
		const user = await UserModel.findOne({ stripeCustomerId })
			.select("subscriptionPeriod")
			.exec();
		return user!;
	}

	async updateById(id: string, data: Partial<IUser>): Promise<IUser> {
		await DBInstance.getConnection();

		const user = await UserModel.findById(id);

		if (!user) {
			throw new Error(`User with id ${id} not found`);
		}

		Object.assign(user, data);

		const updatedUser = await user.save();

		return updatedUser;
	}

	async updateFavorites(id: string, item: string): Promise<IUser> {
		await DBInstance.getConnection();

		// Attempt to add the item (if not present)
		let updatedUser = await UserModel.findOneAndUpdate(
			{ _id: id, favoritesIds: { $ne: item } },
			{ $addToSet: { favoritesIds: item } },
			{ new: true, projection: { favoritesIds: 1, _id: 0 } }
		)
			.lean<IUser>()
			.exec();

		if (updatedUser) {
			return updatedUser;
		}

		// If the item was already in favorites, remove it
		updatedUser = await UserModel.findByIdAndUpdate(
			id,
			{ $pull: { favoritesIds: item } },
			{ new: true, projection: { favoritesIds: 1, _id: 0 } }
		)
			.lean<IUser>()
			.exec();

		return updatedUser!;
	}

	async addToFavorites(id: string, item: string): Promise<IUser> {
		await DBInstance.getConnection();
		const updatedUser = await UserModel.findByIdAndUpdate(
			id,
			{ $addToSet: { favoritesIds: item } },
			{ new: true, projection: { favoritesIds: 1, _id: 0 } }
		)
			.lean<IUser>()
			.exec();
		return updatedUser!;
	}

	async removeFromFavorites(id: string, item: string): Promise<IUser> {
		await DBInstance.getConnection();
		const updatedUser = await UserModel.findByIdAndUpdate(
			id,
			{ $pull: { favoritesIds: item } },
			{ new: true, projection: { favoritesIds: 1, _id: 0 } }
		)
			.lean<IUser>()
			.exec();
		return updatedUser!;
	}

	async saveFavorites(userId: string, favorites: string[]): Promise<IUser> {
		await DBInstance.getConnection();
		const user = await UserModel.findByIdAndUpdate(
			userId,
			{ $set: { favoritesIds: favorites } },
			{ new: true, projection: { favoritesIds: 1, _id: 0 } }
		)
			.lean<IUser>()
			.exec();
		return user!;
	}

	async clearFavorites(userId: string): Promise<IUser> {
		await DBInstance.getConnection();
		const user = await UserModel.findByIdAndUpdate(
			userId,
			{ $set: { favoritesIds: [] } },
			{ new: true, projection: { favoritesIds: 1, _id: 0 } }
		)
			.lean<IUser>()
			.exec();
		return user!;
	}

	async getFavoriteMenuItems(itemIds: string[]): Promise<ProductResponse[]> {
		if (!itemIds || itemIds.length === 0) return [];
		await DBInstance.getConnection();

		// Safely convert to ObjectIds
		const objectIds = itemIds
			.map((id) => {
				try {
					return new Types.ObjectId(id);
				} catch (e) {
					console.warn(`[UserRepo] Invalid ObjectId encountered: ${id}
            error fair ${e}`);
					return null;
				}
			})
			.filter((id): id is Types.ObjectId => id !== null);

		if (objectIds.length === 0) {
			console.warn("[UserRepo] No valid ObjectIds found in favorites list.");
			return [];
		}

		const restaurants = await RestaurantModel.find({
			"menus._id": { $in: objectIds },
		})
			.select("_id name menus")
			.lean()
			.exec();

		const favoriteItems: ProductResponse[] = [];

		restaurants.forEach((restaurant) => {
			restaurant.menus.forEach((menu: IMenuItem) => {
				// Use loose equality or string comparison for safety
				if (objectIds.some((id) => `${id}` === menu._id?.toString())) {
					favoriteItems.push({
						...menu,
						restaurantId: restaurant._id,
						restaurantName: restaurant.name,
					} as ProductResponse);
				}
			});
		});

		return favoriteItems;
	}

	async saveCart(userId: string, cart: ICart[]): Promise<IUser> {
		await DBInstance.getConnection();
		const user = await UserModel.findByIdAndUpdate(
			userId,
			{ cart },
			{ new: true }
		)
			.lean<IUser>()
			.exec();

		return user!;
	}

	async savePasswordResetCode(
		userId: string,
		code: string,
		validTo: string
	): Promise<void> {
		await DBInstance.getConnection();
		await UserModel.findByIdAndUpdate(
			userId,
			{ resetCode: { code, validTo } },
			{ new: true }
		);
	}

	async changePassword(
		userId: string,
		currentPassword: string,
		newPassword: string
	): Promise<boolean> {
		await DBInstance.getConnection();
		const user = await UserModel.findById(userId).select("password");

		const isMatch = await user.comparePassword(currentPassword);

		if (!isMatch) {
			return false;
		}

		user.password = newPassword;
		await user.save();

		return true;
	}

	async deleteById(id: string): Promise<IUser> {
		await DBInstance.getConnection();
		const user = await this.getById(id);
		if (!user) {
			throw new Error(`User with id ${id} not found`);
		}
		return await user.deleteOne();
	}

	// Helper function to convert Mongoose select syntax to $project
	private parseSelectFields(
		selectFields: string | Record<string, 0 | 1>
	): Record<string, 0 | 1> {
		// If already an object, return as is
		if (typeof selectFields === "object") {
			return selectFields;
		}

		// Parse string format like "-password -cart" or "email firstName lastName"
		const projection: Record<string, 0 | 1> = {};
		const fields = selectFields.trim().split(/\s+/);

		fields.forEach((field) => {
			if (field.startsWith("-")) {
				// Exclude field
				projection[field.substring(1)] = 0;
			} else if (field) {
				// Include field
				projection[field] = 1;
			}
		});
		return projection;
	}

	// Analytics methods for AI chatbot
	async getUserCountByRole(role?: string): Promise<number> {
		await DBInstance.getConnection();

		if (role) {
			return await UserModel.countDocuments({ role }).exec();
		}
		return await UserModel.countDocuments().exec();
	}

	async getRecentUserCount(days: number = 30): Promise<number> {
		await DBInstance.getConnection();

		const startDate = new Date();
		startDate.setDate(startDate.getDate() - days);

		return await UserModel.countDocuments({
			createdAt: { $gte: startDate },
		}).exec();
	}

	async getTopUsersByPoints(limit: number = 10): Promise<IUser[]> {
		await DBInstance.getConnection();

		return await UserModel.find({ role: "customer" })
			.sort({ points: -1 })
			.limit(limit)
			.select("firstName lastName points email")
			.lean<IUser[]>()
			.exec();
	}
}

export default UserRepository;
