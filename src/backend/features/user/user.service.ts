import { inject, injectable } from "tsyringe";
import type { IUserRepository } from "./user.repository";
import { Prisma, User } from "@/generated/prisma/client";
import type { IRestaurantRepository } from "../restaurant/restaurant.repository";

export interface IUserService {
	getAll(): Promise<Omit<User, "password">[]>;
	getById(id: string): Promise<Omit<User, "password"> | null>;
	updateById(
		id: string,
		data: Prisma.UserUpdateInput
	): Promise<Omit<User, "password"> | null>;
	updateFavorites(
		id: string,
		data: string[]
	): Promise<Omit<User, "password"> | null>;
	deleteById(id: string): Promise<Omit<User, "password"> | null>;
}

@injectable()
class UserService {
	constructor(
		@inject("IUserRepository") private readonly userRepository: IUserRepository,
		@inject("IRestaurantRepository")
		private readonly restaurantRepository: IRestaurantRepository
	) {}

	async getAll(): Promise<Omit<User, "password">[]> {
		const users = await this.userRepository.getAll();
		return users;
	}

	async getById(id: string): Promise<Omit<User, "password"> | null> {
		return await this.userRepository.getById(id);
	}

	// Needs to Updated later when we have Avatar Upload functionality
	async updateById(
		id: string,
		data: Prisma.UserUpdateInput
	): Promise<Omit<User, "password"> | null> {
		return await this.userRepository.updateById(id, data);
	}

	async updateFavorites(
		id: string,
		data: string[]
	): Promise<Omit<User, "password"> | null> {
		await this.restaurantRepository.updateFavoritedBy(id, data[0]);
		return await this.userRepository.updateFavorites(id, data);
	}

	async deleteById(id: string): Promise<Omit<User, "password"> | null> {
		return await this.userRepository.deleteById(id);
	}
}

export default UserService;
