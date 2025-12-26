import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IProductCart } from "@/types/ProductType";

type CartState = {
  items: Record<string, IProductCart>;
  totalAfterDiscount: number;
};

const initialState: CartState = {
  items: {},
  totalAfterDiscount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart(state, action: PayloadAction<IProductCart[]>) {
      for (const item of action.payload) {
        if (!state.items[item.id]) {
          state.items[item.id] = item;
        }
      }
    },
    addItem(
      state,
      action: PayloadAction<IProductCart & { replace?: boolean }>
    ) {
      const { replace, ...it } = action.payload;
      if (!it.id || it.quantity < 1) {
        console.warn("Invalid cart item:", it);
        return;
      }

      // Check stock availability
      if (!it.inStock) {
        console.warn("Cannot add item: out of stock");
        return;
      }

      const existingItem = state.items[it.id];
      if (existingItem && !replace) {
        const newQuantity = existingItem.quantity + it.quantity;
        // Enforce max quantity limit
        if (newQuantity <= it.maxQuantity) {
          existingItem.quantity = newQuantity;
        } else {
          console.warn("Cannot add more: exceeds available stock");
        }
      } else {
        state.items[it.id] = it;
      }
    },
    updateQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) {
      const { id, quantity } = action.payload;
      const item = state.items[id];

      // Item doesn't exist or invalid quantity
      if (!item || quantity < 0) return;

      // Enforce max quantity limit
      if (quantity > item.maxQuantity) {
        console.warn("Cannot update: exceeds available stock");
        item.quantity = item.maxQuantity;
      } else {
        item.quantity = Math.max(1, quantity);
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      delete state.items[action.payload];
    },
    clearCart(state) {
      state.items = {};
    },
    updateCartTotal(state, action: PayloadAction<{ cartTotal: number }>) {
      state.totalAfterDiscount = action.payload.cartTotal;
    },
  },
});

export const {
  hydrateCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  updateCartTotal,
} = cartSlice.actions;
export default cartSlice.reducer;

export const isInCartSelector = (state: RootState, productId: string) =>
  state.cart.items[productId];
