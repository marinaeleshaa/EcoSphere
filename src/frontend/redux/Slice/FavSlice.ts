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

export const getFavorites = createAsyncThunk("fav/getFavorites", async (_) => {
  const res = await fetch("/api/users/favorites", {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch favorites");

  const { data } = await res.json();
  return data;
});

export const syncGuestFavorites = createAsyncThunk(
  "fav/syncGuestFavorites",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const ids = state.fav.favProducts.map((p) => p.id);

    if (!ids.length) return;

    await fetch("/api/users/favorites", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
  }
);

export const toggleFavoriteAsync = createAsyncThunk(
  "fav/toggleFavoriteAsync",
  async (product: IProduct) => {
    const res = await fetch("/api/users/favorites", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ids: product.id }),
    });

    if (!res.ok) {
      throw new Error("Failed to toggle favorite");
    }

    return product;
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
        const product = action.payload;
        const exists = state.favProducts.some((p) => p.id === product.id);

        state.favProducts = exists
          ? state.favProducts.filter((p) => p.id !== product.id)
          : [...state.favProducts, product];
      })
      .addCase(toggleFavoriteAsync.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { toggleFavView, clearFav } = FavSlice.actions;
export default FavSlice.reducer;

export const isInFavSelector = (state: RootState, productId: string) =>
  state.fav.favProducts.some((p) => p.id === productId);
