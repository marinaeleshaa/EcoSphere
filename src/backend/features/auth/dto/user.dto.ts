import { Gender, UserRole } from "../../user/user.model";
import { IUser } from "../../user/user.model";
import { IRestaurant } from "../../restaurant/restaurant.model";
import { imageService } from "../../../services/image.service";

export type LoginRequestDTO = {
	email: string;
	password: string;
};

export type LoginResponse = {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	password: string;
	birthDate: string;
	address: string;
	avatar?: string;
	gender: string;
	phoneNumber: string;
	role: LoginTypes;
    // Shop specific
    location?: string;
    workingHours?: string;
    description?: string;
    hotline?: string;
    name?: string;
};

export type LoginResponseDTO = {
    token: string;
    user: PublicUserProfile;
};

// Token payload type for JWT
export type TokenPayload = {
	_id: string;
	email: string;
	lastName?: string;
	name?: string;
	role: string;
};

// Type for the mapped user profile (what the frontend receives)
export class PublicUserProfile {
    _id!: string;
    id!: string;
    email!: string;
    firstName?: string;
    lastName?: string;
    name?: string; // For restaurants
    phoneNumber?: string;
    address?: string;
    location?: string; // For restaurants
    avatar!: string; // Always a string URL, not an object
    birthDate?: string;
    gender?: string;
    role!: string;
    points?: number;
    favoritesIds?: string[];
    cart?: any[];
    paymentHistory?: any[];
    subscriptionPeriod?: Date | string;
    subscribed?: boolean;
    events?: any[];
    workingHours?: string; // For restaurants
    description?: string; // For restaurants
    menu?: any[];
    reviews?: any[];
    hotline?: number;

    private constructor(data: Partial<PublicUserProfile>) {
        Object.assign(this, data);
    }

    // Factory method for creating from IUser (customer/organizer)
    static async fromUser(user: IUser): Promise<PublicUserProfile> {
        let avatarUrl = "";
        if (user.avatar?.key) {
            avatarUrl = await imageService.getSignedUrl(user.avatar.key);
        }

        return new PublicUserProfile({
            _id: user._id.toString(),
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address || "",
            avatar: avatarUrl,
            birthDate: user.birthDate,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            role: user.role,
            points: user.points || 0,
            favoritesIds: user.favoritesIds,
            cart: user.cart,
            paymentHistory: user.paymentHistory,
            subscriptionPeriod: user.subscriptionPeriod,
            subscribed: user.subscribed,
            events: user.events,
        });
    }

    // Factory method for creating from IRestaurant
    static async fromRestaurant(shop: IRestaurant): Promise<PublicUserProfile> {
        let avatarUrl = "";
        if (shop.avatar?.key) {
            avatarUrl = await imageService.getSignedUrl(shop.avatar.key);
        }

        return new PublicUserProfile({
            _id: shop._id.toString(),
            id: shop._id.toString(),
            email: shop.email,
            name: shop.name,
            role: "shop",
            phoneNumber: shop.phoneNumber,
            location: shop.location,
            avatar: avatarUrl,
            workingHours: shop.workingHours,
            description: shop.description || "",
            menu: shop.menus,
            reviews: shop.restaurantRating,
            subscribed: shop.subscribed,
            subscriptionPeriod: shop.subscriptionPeriod,
        });
    }

    // Create TokenPayload from user
    static toTokenPayload(user: IUser): TokenPayload {
        return {
            _id: user._id.toString(),
            email: user.email,
            lastName: user.lastName,
            role: user.role,
        };
    }

    // Create TokenPayload from restaurant
    static toTokenPayloadFromRestaurant(shop: IRestaurant): TokenPayload {
        return {
            _id: shop._id.toString(),
            email: shop.email,
            name: shop.name,
            role: "shop",
        };
    }
}

export class RegisterResponseDTO {
	token: string;
	user: PublicUserProfile;

    private constructor(token: string, user: PublicUserProfile) {
        this.token = token;
        this.user = user;
    }

    // Factory method for creating registration response
    static async create(token: string, user: IUser | IRestaurant): Promise<RegisterResponseDTO> {
        // Check if it's a restaurant by checking for 'name' property (restaurants have name, users have firstName/lastName)
        const isRestaurant = 'name' in user && !('firstName' in user);
        const profile = isRestaurant
            ? await PublicUserProfile.fromRestaurant(user as IRestaurant)
            : await PublicUserProfile.fromUser(user as IUser);
        
        return new RegisterResponseDTO(token, profile);
    }
}

export type UserTypes = UserRole | "shop";

export type FoundedUser = {
	_id: string;
	email: string;
	name: string;
	password: string;
	role: string;
	oAuthId?: string;
	accountProvider?: string;
	comparePassword?: (password: string) => Promise<boolean>;
};

export type OAuthUserDTO = RegisterRequestDTO &
	RegisterForConsumer & {
		role: UserTypes;
		oAuthId: string;
		provider?: string;
	};

export type UserRegisterDTO = RegisterWithCredentialsDTO &
	RegisterForConsumer &
	RegisterWithPhoneNumber & {
		birthDate: string;
		gender: Gender;
		address?: string;
	};

export type ShopRegisterDTO = RegisterWithCredentialsDTO &
	RegisterWithPhoneNumber & {
		name: string;
		description: string;
		hotline: string;
		avatar?: string;
		location?: string;
		workingHours: string;
	};

export type RegisterRequestDTO = {
	email: string;
	role: UserTypes;
};

export type RegisterWithCredentialsDTO = RegisterRequestDTO & {
	password: string;
};

export type RegisterForConsumer = {
	firstName: string;
	lastName: string;
};

export type RegisterWithPhoneNumber = {
	phoneNumber: string;
};

export type LoginTypes = UserTypes;
