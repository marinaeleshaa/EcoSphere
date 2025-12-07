import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { rootContainer } from "./backend/config/container";
import AuthController from "./backend/features/auth/auth.controller";
import UserController from "./backend/features/user/user.controller";

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [
		CredentialsProvider({
			name: "Login with Email",
			credentials: {
				email: { label: "Email", type: "email", placeholder: "" },
				password: { label: "Password", type: "password", placeholder: "" },
			},
			authorize: async (credentials) => {
				try {
					const controller = rootContainer.resolve(AuthController);
					const response = await controller.loginWithCredentials({
						email: credentials.email as string,
						password: credentials.password as string,
					});
					if (!response) return null;

					// Return user object with id and other properties
					return response;
				} catch (error) {
					console.error(
						"Authorization error:",
						error instanceof Error ? error.message : error
					);
					return null;
				}
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async signIn({ user, account, profile }) {
			switch (account?.provider) {
				case "google": {
					const [firstName, ...rest] = (profile?.name ?? "").split(" ");
					const lastName = rest.join(" ");
					return !!(await rootContainer
						.resolve(AuthController)
						.LoginWithGoogle({
							firstName: firstName,
							lastName: lastName,
							email: user?.email as string,
							role: "customer",
							oAuthId: account.providerAccountId,
							provider: account.provider,
						}));
				}
				case "credentials":
					return true;
				default:
					return false;
			}
		},
		async jwt({ token, user, account, profile }) {
			if (user) {
				token.userId = user.id;
				token.role = user.role;
			}
			if (account?.provider === "google") {
				token.role = "customer";
				token.image = profile?.picture;
				token.userId = `${
					(
						await rootContainer
							.resolve(UserController)
							.getUserIdByEmail(user.email!)
					)._id
				}`;
			}
			return token;
		},

		async session({ session, token }) {
			if (token) {
				session.user.id = token.userId as string;
				session.user.email = token.email as string;
				session.user.role = token.role as string;
				session.user.name = token.name as string;
				session.user.image = token.image as string;
			}
			return session;
		},
	},

	pages: {
		signIn: "/auth",
		error: "/auth",
		signOut: "/auth",
	},

	// Add these important NextAuth v5 configs
	trustHost: true, // Important for development
	secret: process.env.AUTH_SECRET, // Required in production
});
