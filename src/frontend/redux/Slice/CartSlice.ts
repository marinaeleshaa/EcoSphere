import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartItems } from "@/types/cart";

type CartState = {
  items: Record<string, CartItems>;
};

const initialState: CartState = {
  items: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart(state, action: PayloadAction<CartItems[]>) {
      for (const item of action.payload) {
        if (!state.items[item.id]) {
          state.items[item.id] = item;
        }
      }
    },
    addItem(state, action: PayloadAction<CartItems & { replace?: boolean }>) {
      const { replace, ...it } = action.payload;
      if (!it.id || it.quantity < 1) {
        console.warn("Invalid cart item:", it);
        return; // Don't add invalid items
      }
      if (state.items[it.id] && !replace) {
        state.items[it.id].quantity += it.quantity;
      } else {
        state.items[it.id] = it;
      }
    },
    updateQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) {
      const { id, quantity } = action.payload;
      // Item doesn't exist or invalid quantity
      if (!state.items[id] || quantity < 0) return;
      state.items[id].quantity = Math.max(1, quantity);
    },
    removeItem(state, action: PayloadAction<string>) {
      delete state.items[action.payload];
    },
    clearCart(state) {
      state.items = {};
    },
  },
});

export const { hydrateCart, addItem, updateQuantity, removeItem, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
