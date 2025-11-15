import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Login with Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "" },
        password: { label: "Password", type: "password", placeholder: "" },
      },
      authorize: async (credentials) => {
        const response = await fetch("/api/authunticate/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const { result } = await response.json();
        if (response.ok && result.user && result.token) {
          return result;
        } else {
          return null;
        }
      },
    }),
    CredentialsProvider({
      name: "Register with Email",
      credentials: {
        name: { label: "Name", type: "text", placeholder: "" },
        email: { label: "Email", type: "email", placeholder: "" },
        password: { label: "Password", type: "password", placeholder: "" },
      },
      authorize: async (credentials) => {
        const response = await fetch("/api/authunticate/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: credentials?.name,
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const { result } = await response.json();
        if (response.ok && result.user && result.token) {
          return result;
        } else {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};

export default NextAuth(authOptions);
