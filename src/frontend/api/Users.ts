import { Shop, User } from "@/types/UserTypes";

export const getUserData = async <T = User | Shop>(
  id: string,
  role: string
): Promise<T> => {
  let response =
    role === "shop"
      ? await fetch(`/api/shops/${id}`)
      : await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  const { data } = await response.json();
  return data as T;
};
