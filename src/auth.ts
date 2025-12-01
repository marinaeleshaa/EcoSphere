import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { rootContainer } from "./backend/config/container";
import AuthController from "./backend/features/auth/auth.controller";

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
						loginType: (credentials as any).loginType,
					} as any);
					if (!response) return null;

					// Return user object with id and other properties
					return response as any;
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
			const controller = rootContainer.resolve(AuthController);
			switch (account?.provider) {
				case "google":
					// You can add additional logic here for Google sign-ins if needed
					return !!(await controller.LoginWithGoogle({
						firstName: profile?.given_name as string,
						lastName: profile?.family_name as string,
						email: user?.email as string,
						role: "customer",
						oAuthId: account.providerAccountId,
						provider: account.provider,
					}));
				case "credentials":
					// You can add additional logic here for Credentials sign-ins if needed
					return true;
				default:
					return false;
			}
		},
		async jwt({ token, user }) {
			if (user) {
                // user is LoginResponseDTO { token, user: PublicUserProfile }
                const u = (user as any).user || user;
				token.id = u.id || u._id;
				token.email = u.email;
				token.role = u.role;
				token.name = u.name || (u.firstName ? `${u.firstName} ${u.lastName}` : "");
                token.accessToken = (user as any).token;
			}
			return token;
		},

		async session({ session, token }) {
			if (token) {
				session.user.id = token.id as string;
				session.user.email = token.email as string;
				session.user.role = token.role as string;
				session.user.name = token.name as string;
			}
			return session;
		},
	},

	pages: {
		signIn: "/auth",
	},

	// Add these important NextAuth v5 configs
	trustHost: true, // Important for development
	secret: process.env.AUTH_SECRET, // Required in production
});
