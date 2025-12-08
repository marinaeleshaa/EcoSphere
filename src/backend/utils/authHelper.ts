import { auth } from "@/auth";

// In NextAuth v5, just use auth() directly - no need for getServerSession
export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}