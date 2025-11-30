import jwt from "jsonwebtoken";
import { TokenPayload } from "../features/auth/dto/user.dto";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export const signJwt = (payload: TokenPayload): string => {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyJwt = (token: string): TokenPayload => {
	return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

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
