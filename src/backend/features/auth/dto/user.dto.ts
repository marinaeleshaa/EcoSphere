import { TokenPayload } from "@/backend/interfaces/interfaces";
import { UserRole } from "../../user/user.model";

export type LoginRequestDTO = {
	email: string;
	password: string;
	loginType: LoginTypes;
};

export type LoginResponseDTO = {
	token: string;
	user: TokenPayload;
};

export type RegisterRequestDTO = {
	email: string;
	name: string;
	password: string;
	birthDate: string;
	address: string;
	avatar: string;
	gender: string;
	phoneNumber: string;
	role: LoginTypes;
};

export type RegisterResponseDTO = {
	token: string;
	user: TokenPayload;
};

export type LoginTypes = UserRole | "shop";
