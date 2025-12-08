// src/store/selectors/cartSelectors.ts
import { RootState } from "../store";
import { createSelector } from "@reduxjs/toolkit";

// Basic selector - just returns the data
export const selectCartItems = (state: RootState) => state.cart.items;

// Memoized selector - only recalculates when cart.items changes
export const selectCartItemsArray = createSelector([selectCartItems], (items) =>
	Object.values(items)
);

// Calculate total price - only recalculates when items array changes
export const selectCartTotal = createSelector([selectCartItemsArray], (items) =>
	items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// Calculate total item count
export const selectCartItemCount = createSelector(
	[selectCartItemsArray],
	(items) => items.reduce((sum, item) => sum + item.quantity, 0)
);

// Get specific item by ID
export const selectCartItem = (id: string) =>
	createSelector([selectCartItems], (items) => items[id] ?? null);
