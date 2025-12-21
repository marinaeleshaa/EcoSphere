import { IOrder } from "@/backend/features/orders/order.model";
import { OrderRequestItem } from "@/backend/features/orders/order.types";
import { ApiResponse } from "@/types/api-helpers";

export const createPaymentIntent = async (
  amount: number,
  metaData: Record<string, string>,
  currency: string = "usd",
): Promise<{ clientSecret: string }> => {
  const response = await fetch("/api/stripe/payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency, metaData }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch((err) => console.error(err));
    throw new Error(errorData.error || "Failed to create payment intent");
  }

  return response.json();
};

export const createOrder = async (
  items: OrderRequestItem[],
): Promise<ApiResponse<IOrder>> => {
  const response = await fetch("/api/orders", {
    method: "POST",
    body: JSON.stringify(items),
  });

  if (!response.ok) {
    const errorData = await response.json().catch((err) => console.error(err));
    throw new Error(errorData.error || "Failed to create order");
  }

  const data = await response.json();
  return data;
};

export const getOrderById = async (
  orderId: string,
): Promise<ApiResponse<IOrder>> => {
  const response = await fetch(`/api/orders/${orderId}`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch order");
  }

  const data = await response.json();
  return data;
};
