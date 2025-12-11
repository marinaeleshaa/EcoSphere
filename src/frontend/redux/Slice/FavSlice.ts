import { IProduct } from "@/types/ProductType";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/frontend/redux/store";
import { getCurrentUser } from "@/backend/utils/authHelper";
import { useSession } from "next-auth/react";

interface FavState {
  view: "grid" | "horizontal";
  favProducts: IProduct[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: FavState = {
  view: "grid",
  favProducts: [],
  status: "idle",
};

export const getFavorites = createAsyncThunk(
  "fav/getFavorites",
  async (_, { getState }) => {
    const res = await fetch("/api/users/favorites", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch favorites");

    const data: IProduct[] = await res.json();

    const state = getState() as RootState;
    const existingFavs = state.fav.favProducts;
    
    const merged = Array.from(
      new Map(
        [...existingFavs, ...data].map((item) => [item.id, item])
      ).values()
    );

    return merged;
  }
);

export const toggleFavoriteAsync = createAsyncThunk(
  "fav/toggleFavoriteAsync",
  async (product: Partial<IProduct>) => {
    const res = await fetch("/api/users/favorites", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ favoritesIds: product.id }),
    });

    if (!res.ok) throw new Error("Failed to toggle favorite");

    const updatedFavs: IProduct[] = await res.json();
    return updatedFavs;
  }
);

const FavSlice = createSlice({
  name: "fav",
  initialState,
  reducers: {
    toggleFavView(state) {
      state.view = state.view === "grid" ? "horizontal" : "grid";
    },
    clearFav(state) {
      state.favProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFavorites.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.favProducts = action.payload;
      })
      .addCase(getFavorites.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(toggleFavoriteAsync.fulfilled, (state) => {
        state.status = "succeeded";
      });
  },
});

export const { toggleFavView, clearFav } = FavSlice.actions;
export default FavSlice.reducer;

export const isInFavSelector = (state: RootState, productId: string) =>
  state.fav.favProducts.some((p) => p.id === productId);
