import { Gender, UserRole } from "../../user/user.model";

export type LoginRequestDTO = {
	email: string;
	password: string;
};

export type LoginResponse = {
	id: string;
	email: string;
	name: string;
	role: string;
};

export type RegisterResponseDTO = {
	success: boolean;
};

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
	};

export type ShopRegisterDTO = RegisterWithCredentialsDTO &
	RegisterWithPhoneNumber & {
		name: string;
		description: string;
		hotline: string;
		file: string;
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
