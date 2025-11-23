import { injectable } from "tsyringe";
import { IUser, UserModel } from "../user/user.model";
import { DBInstance } from "@/backend/config/dbConnect";
import { ObjectId } from "mongoose";
import { RegisterRequestDTO } from "./dto/user.dto";
import { IRestaurant, RestaurantModel } from "../restaurant/restaurant.model";

export interface IAuthRepository {
	register(
		email: string,
		name: string,
		password: string,
		birthDate: string,
		address: string,
		avatar: string,
		gender: Gender,
		phoneNumber: string
	): Promise<User>;
	existsByEmail(email: string): Promise<{ _id: ObjectId } | null>;
	saveNewUser(data: RegisterRequestDTO): Promise<IUser>;
	findUserByEmail(email: string): Promise<IUser | null>;
	findShopByEmail(email: string): Promise<IRestaurant>;
	me(): Promise<User[]>;
}

@injectable()
class AuthRepository {
	async register(
		email: string,
		name: string,
		password: string,
		birthDate: string,
		address: string,
		avatar: string,
		gender: Gender,
		phoneNumber: string
	): Promise<User | null> {
		return (await prisma.user.create({
			data: {
				email,
				name,
				password,
				birthDate,
				address: address || null,
				avatar: avatar || null,
				gender,
				phoneNumber,
			},
			select: {
				id: true,
				email: true,
				name: true,
				phoneNumber: true,
				address: true,
				avatar: true,
				birthDate: true,
				createdAt: true,
				points: true,
				role: true,
				gender: true,
			},
		})) as User;
	}

	async existsByEmail(email: string) {
		await DBInstance.getConnection();

		return await UserModel.exists({ email }).lean().exec();
	}

	async saveNewUser(data: RegisterRequestDTO): Promise<IUser> {
		const savedUser = await UserModel.create(data);
		return savedUser;
	}

	async findByEmail(email: string): Promise<Partial<IUser> | null> {
		await DBInstance.getConnection();

		console.log({ email });
		return await UserModel.findOne({ email }).select("+password").exec();
	}

	async findShopByEmail(email: string): Promise<IRestaurant> {
		await DBInstance.getConnection();

		return await RestaurantModel.findOne({ email }).select("+password").exec();
	}
}

export default AuthRepository;
