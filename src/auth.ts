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
			// When NextAuth authorizes a user object (credentials provider), that `user`
			// object contains fields returned by our controller (mapToUserPublicProfile).
			// Copy standard fields and subscription info (when present) into token so
			// we can later expose them via session().
			if (user) {
				token.userId = user.id;
				token.role = user.role;
				token.image = user.image;

				if (user.subscribed) {
					token.subscribed = user.subscribed;
				}

				const rawPeriod = user.subscriptionPeriod;
				if (rawPeriod) {
					try {
						if (rawPeriod instanceof Date) {
							token.subscriptionPeriod = rawPeriod.toISOString();
						} else {
							token.subscriptionPeriod = `${rawPeriod}`;
						}
					} catch {
						token.subscriptionPeriod = `${rawPeriod}`;
					}
				}
			}

			// Google provider flow: the 'user' may not include DB-mapped subscription fields
			// because we create/find the DB user separately. For Google logins we keep existing
			// behavior (role=customer) — customers don't get subscription fields in token.
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
				const userId = token.userId as string | undefined;
				if (userId) {
					try {
						const fresh = await fetchFreshUser(userId);
						mapUserToSession(session, fresh, token);
						return session;
					} catch {
						// Fall through to token mapping on error
					}
				}
				mapTokenToSession(session, token);
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

async function fetchFreshUser(userId: string) {
	const userController = rootContainer.resolve(UserController);
	return await userController.getById(
		userId,
		"subscribed subscriptionPeriod email firstName lastName avatar role"
	);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapUserToSession(session: any, fresh: any, token: any) {
	// ID and basic fields with safe fallbacks
	session.user.id = `${fresh._id ?? token.userId}`;
	session.user.email = `${fresh.email ?? token.email}`;
	session.user.role = `${fresh.role ?? token.role}`;

	// Name: prefer firstName/lastName, then name, then token-provided name
	const firstName = fresh.firstName as string | undefined;
	const lastName = fresh.lastName as string | undefined;
	const fallbackName = token.name;
	session.user.name = firstName
		? `${firstName} ${lastName ?? ""}`.trim()
		: `${fallbackName}`;

	// Image: check avatar.url structure safely
	if (fresh.avatar?.url) {
		session.user.image = `${fresh.avatar?.url}`;
	} else {
		session.user.image = `${token.image ?? ""}`;
	}

	// Subscription fields: only set if present on fresh record
	if (fresh.subscribed) {
		session.user.subscribed = fresh.subscribed;
	}
	if (fresh.subscriptionPeriod) {
		const p = fresh.subscriptionPeriod;
		// If it's a Date object, convert to ISO, otherwise stringify
		if (p instanceof Date) {
			session.user.subscriptionPeriod = p.toISOString();
		} else {
			session.user.subscriptionPeriod = `${p}`;
		}
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTokenToSession(session: any, token: any) {
	session.user.id = token.userId as string;
	session.user.email = token.email as string;
	session.user.role = token.role as string;
	session.user.name = token.name as string;
	session.user.image = token.image as string;
	if (token.subscribed) {
		session.user.subscribed = token.subscribed as boolean;
	}
	if (token.subscriptionPeriod) {
		session.user.subscriptionPeriod = token.subscriptionPeriod as string;
	}
}
