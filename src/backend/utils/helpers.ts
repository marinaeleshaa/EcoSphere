import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { TokenPayload } from "../interfaces/interfaces";
import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
	password: string,
	hashedPassword: string
) => await bcrypt.compare(password, hashedPassword);

export const generateToken = (payload: TokenPayload) => {
	return jwt.sign(
		payload,
		process.env.JWT_SECRET as Secret,
		{ expiresIn: process.env.JWT_EXPIRES_IN ?? "7d" } as SignOptions
	);
};

export const verifyToken = (token: string) =>
	jwt.verify(token, process.env.JWT_SECRET as Secret);

export const OMIT = <T, K extends keyof T>(
	obj: T,
	...keys: K[]
): Omit<T, K> => {
	const ret = { ...obj };
	for (const key of keys) {
		delete ret[key];
	}
	return ret;
};
