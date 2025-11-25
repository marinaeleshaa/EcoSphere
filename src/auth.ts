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
					const response = await controller.login({
						email: credentials.email as string,
						password: credentials.password as string,
					});
					if (!response) return null;

					// Return user object with id and other properties
					return response;
				} catch (error) {
					console.error("Authorization error:", error?.message);
					return null;
				}
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		// async signIn({ user, account, profile }) {
		//   const controller = rootContainer.resolve(AuthController);
		//   switch (account?.provider) {
		//     case "google":
		//       // You can add additional logic here for Google sign-ins if needed
		//       return true;
		//     case "credentials":
		//       // You can add additional logic here for Credentials sign-ins if needed
		//       return true;
		//     default:
		//       return true;
		//   }
		// },
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role;
			}
			return token;
		},

		async session({ session, token }) {
			if (token) {
				session.user.role = token.role as string;
			}
			return session;
		},
	},

	// pages: {
	// 	signIn: "/auth",
	// },

	// Add these important NextAuth v5 configs
	trustHost: true, // Important for development
	secret: process.env.AUTH_SECRET, // Required in production
});
