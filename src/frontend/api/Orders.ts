import { IOrder } from "@/backend/features/orders/order.model";

const API_URL = "/api/orders";

export const getUserOrders = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Error fetching user orders: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data as IOrder[];
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

export const getRestaurantOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/restaurant`);
    if (!response.ok) {
      throw new Error(
        `Error fetching restaurant orders: ${response.statusText}`
      );
    }
    const json = await response.json();
    return json.data as IOrder[];
  } catch (error) {
    console.error("Error fetching restaurant orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const response = await fetch(`${API_URL}/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error(`Error updating order status: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data as IOrder;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const response = await fetch(`${API_URL}/${orderId}`);
    if (!response.ok) {
      throw new Error(`Error fetching order by id: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data as IOrder;
  } catch (error) {
    console.error("Error fetching order by id:", error);
    throw error;
  }
};
