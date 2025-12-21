import { IProduct } from "@/types/ProductType";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/frontend/redux/store";

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
    const state = getState() as RootState;
    const { isLoggedIn } = state.user;

    // If not logged in, return current favorites from local state (persist)
    if (!isLoggedIn) {
      return state.fav.favProducts || [];
    }

    const res = await fetch("/api/users/favorites", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch favorites");

    const { data } = await res.json();

    const existingFavs = state.fav.favProducts || [];

    // Merge backend favorites with local favorites (optional but good for sync)
    const merged = Array.from(
      new Map(
        [...existingFavs, ...data].map((item: any) => [item.id, item])
      ).values()
    );

    return merged;
  }
);

export const toggleFavoriteAsync = createAsyncThunk(
  "fav/toggleFavoriteAsync",
  async (product: Partial<IProduct>, { getState }) => {
    const state = getState() as RootState;
    const { isLoggedIn } = state.user;

    if (isLoggedIn) {
      const res = await fetch("/api/users/favorites", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ids: product.id }),
      });

      if (!res.ok) throw new Error("Failed to toggle favorite");

      const { data } = await res.json();
      return data;
    } else {
      // Logic for non-logged in users (local state)
      const currentFavs = state.fav.favProducts || [];
      const isFav = currentFavs.some((p) => p.id === product.id);

      if (isFav) {
        // Remove from favorites
        return currentFavs.filter((p) => p.id !== product.id);
      } else {
        // Add to favorites
        return [...currentFavs, product as IProduct];
      }
    }
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

      .addCase(toggleFavoriteAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.favProducts = action.payload;
      });
  },
});

export const { toggleFavView, clearFav } = FavSlice.actions;
export default FavSlice.reducer;

export const isInFavSelector = (state: RootState, productId: string) =>
  state.fav.favProducts.some((p) => p.id === productId);
