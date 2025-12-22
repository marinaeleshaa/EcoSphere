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

export const sendCode = async (email: string) => {
  const response = await fetch("/api/auth/send-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    throw new Error("Failed to send code");
  }
  return await response.json();
};

export const verify = async (email: string, code: string) => {
  const response = await fetch("/api/auth/verify-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
  });
  if (!response.ok) {
    throw new Error("Failed to verify code");
  }
  return await response.json();
};

export const resetPassword = async (email: string, newPassword: string) => {
  const response = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, newPassword }),
  });
  if (!response.ok) {
    throw new Error("Failed to reset password");
  }
  return await response.json();
};

export const changeUserPassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const response = await fetch(`/api/users/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!response.ok) {
    throw new Error("Failed to change password");
  }
  return response.json();
};

export const redeemUserPoints = async (userId: string) => {
  const response = await fetch(`/api/users/redeem-points/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to redeem points");
  }
  return response.json();
};
