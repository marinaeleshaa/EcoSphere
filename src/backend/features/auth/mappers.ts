import { IRestaurant } from "../restaurant/restaurant.model";
import { IUser } from "../user/user.model";

export const mapToUserPublicProfile = (
	user: Partial<IUser> | Partial<IRestaurant>
) => {
	return {
		id: user._id!,
		email: user.email!,
		name: isUser(user) ? user.lastName! : user.name!,
		role: isUser(user) ? user.role! : "shop",
	};
};

const isUser = (
	u: Partial<IUser> | Partial<IRestaurant>
): u is Partial<IUser> => {
	return "lastName" in u;
};
