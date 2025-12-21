import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			role: string;
		} & DefaultSession["user"];
	}

	interface User {
		role: string;
    picture?: string;
		subscribed?: boolean;
		subscriptionPeriod?: string | Date;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		role: string;
	}
}
