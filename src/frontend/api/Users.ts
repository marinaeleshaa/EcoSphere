import { Shop, User } from "@/types/UserTypes";

export const getUserData = async <T = User | Shop>(
  id: string,
  role: string,
  searchQuery?: string
): Promise<T> => {
  const url =
    role === "shop" ? `/api/shops/${id}` : `/api/users/${id}?q=${searchQuery}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  const { data } = await response.json();
  return data as T;
};

export const updateUserPoints = async (points: number) => {
  const response = await fetch(`/api/users/points`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ points }),
  });
  if (!response.ok) {
    throw new Error("Failed to update user points");
  }
  return response.json();
};
