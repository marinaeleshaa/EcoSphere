import { IRestaurant } from "../restaurant/restaurant.model";
import { IUser, UserRole } from "../user/user.model";
import { RegisterResponseDTO } from "./dto/user.dto";

export type LoginCommand = {
	email: string;
	password: string;
	userType: UserRole;
};

export type RegisterCommand = {
	user: Pick<IUser, "lastName" | "email" | "role" | "_id">;
} & { token: string };

export const mapRegisterResultToDto = (
	command: RegisterCommand
): RegisterResponseDTO => {
	return {
		token: command.token,
		user: {
			id: command.user._id!.toString(),
			email: command.user.email,
			lastName: command.user.lastName,
			role: command.user.role,
		},
	};
};

export const mapUserToPublicProfile = (user: IUser) => {
	return {
		id: user._id!.toString(),
		email: user.email,
		lastName: user.lastName,
		role: user.role,
	};
};

export const mapShopToPublicProfile = (shop: IRestaurant) => {
	return {
		id: shop._id!,
		email: shop.email,
		lastName: shop.name,
		role: "shop",
	};
};
