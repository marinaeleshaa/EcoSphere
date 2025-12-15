import { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
} from "../Slice/CartSlice";
import { ICart } from "@/backend/features/user/user.model";
import { IProductCart } from "@/types/ProductType";
import {
  ensureAuthStatus,
  getAuthStatus,
  resetAuthStatus,
} from "@/lib/auth/authRuntime";

let syncTimeout: NodeJS.Timeout | null = null;
let isSyncing = false;

export const cartSyncMiddleware: Middleware =
  (store) => (next) => async (action: any) => {
    const result = next(action);

    // Determine if we should sync and how long to wait
    let shouldSync = false;
    let delay = 3000; // default 3 seconds

    await ensureAuthStatus();
    if (!getAuthStatus()) return;

    switch (action.type) {
      case addItem.type:
      case updateQuantity.type:
        shouldSync = true;
        delay = 3000; // 3 seconds - user might do more actions
        break;

      case removeItem.type:
        shouldSync = true;
        delay = 1000; // 1 second - important action
        break;

      case clearCart.type:
        shouldSync = true;
        delay = 0; // immediate
        break;
    }

    if (shouldSync) {
      if (syncTimeout) clearTimeout(syncTimeout);

      const canSync = getAuthStatus();
      if (!canSync) return result;

      syncTimeout = setTimeout(async () => {
        if (isSyncing) return; // Prevent concurrent syncs

        isSyncing = true;
        const cartItems = getCartData(store);

        // Transform cart items for backend
        const data = mapCartBackendData(cartItems);
        await syncCartToBackend(data);
        isSyncing = false;
      }, delay);
    }

    return result;
  };

async function syncCartToBackend(items: ICart[]) {
  try {
    const response = await fetch("/api/cart/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
      credentials: "include", // Include cookies for auth
    });

    if (response.status === 401) {
      resetAuthStatus(); // ✅ backend is authoritative
      return;
    }

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status}`);
    }

    console.log("✅ Cart synced successfully");
  } catch (error) {
    console.error("❌ Cart sync failed:", error);
    // Could dispatch an action here to show user an error
  }
}

// Handle page unload
if (globalThis.window !== undefined) {
  let store: any = null;

  // Store reference will be set by store.ts
  (globalThis as any).__setCartSyncStore = (s: any) => {
    store = s;
  };

  window.addEventListener("beforeunload", () => {
    if (store) {
      const cartItems = getCartData(store);

      // Use sendBeacon for reliable sync
      navigator.sendBeacon(
        "/api/cart/sync",
        new Blob([JSON.stringify(mapCartBackendData(cartItems))], {
          type: "application/json",
        }),
      );
    }
  });
}

const getCartData = (store: MiddlewareAPI) => {
  const state = store.getState();
  const cartItems: IProductCart[] = Object.values(state.cart.items);
  return cartItems;
};

export const mapCartBackendData = (cartItems: IProductCart[]) => {
  const mappedData = cartItems.map(
    (item) =>
      ({
        restaurantId: item.restaurantId,
        productId: item.id,
        quantity: item.quantity,
      }) as ICart,
  );
  return mappedData;
};
