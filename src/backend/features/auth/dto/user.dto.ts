import { TokenPayload } from "@/backend/interfaces/interfaces";
import { UserRole } from "../../user/user.model";

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

export type RegisterRequestDTO = OAuthUserDTO & {
	password?: string;
	birthDate?: string;
	address?: string;
	avatar?: string;
	gender?: string;
	phoneNumber?: string;
	hotline?: string;
};

export type RegisterResponseDTO = {
	token: string;
	user: TokenPayload;
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

export type OAuthUserDTO = {
	email: string;
	firstName: string;
	lastName: string;
	role: UserTypes;
	oAuthId: string;
	provider?: string;
};
