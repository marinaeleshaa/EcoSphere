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
			_id: command.user._id,
			email: command.user.email,
			lastName: command.user.lastName,
			role: command.user.role,
		},
	};
};

export const mapUserToTokenPayload = (user: IUser) => {
	return {
		_id: user._id,
		email: user.email,
		lastName: user.lastName,
		role: user.role,
	};
};

export const mapRestaurantToTokenPayload = (user: IRestaurant) => {
	return {
		_id: user._id,
		email: user.email,
		lastName: user.name,
		role: "shop",
	};
};

export const mapUserAsEndUser = (user: IUser) => {
	return {
		_id: user._id,
		email: user.email,
		lastName: user.lastName,
		address: user.address || "",
		avatar: user.avatar || "",
		birthDate: user.birthDate,
		phoneNumber: user.phoneNumber,
		role: "endUser",
		points: user.points || 0,
		favePlaces: user.favoritesIds,
		cart: user.cart,
		paymentHistory: user.paymentHistory,
	};
};

export const mapUserAsOrganizer = (user: IUser) => {
	return {
		_id: user._id,
		email: user.email,
		lastName: user.lastName,
		phoneNumber: user.phoneNumber,
		role: "organizer",
		subscriptionPeriod: user.subscriptionPeriod,
		subscribed: user.subscribed,
		avatar: user.avatar || "",
		events: user.events,
	};
};

export const mapShopToPublicProfile = (shop: IRestaurant) => {
	return {
		_id: shop._id,
		email: shop.email,
		lastName: shop.name,
		role: "shop",
		phoneNumber: shop.phoneNumber,
		address: shop.location,
		avatar: shop.avatar || "",
		openingHours: shop.workingHours,
		description: shop.description || "",
		menu: shop.menus,
		reviews: shop.restaurantRating,
		subscribed: shop.subscribed,
		subscriptionPeriod: shop.subscriptionPeriod,
	};
};
