import { IProduct } from "@/types/ProductType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/frontend/Redux/store";

interface FavState {
  view: "grid" | "horizontal";
  favProducts: IProduct[];
}

const savedFavs = typeof window !== "undefined" ? localStorage.getItem("favProducts") : null;

const initialState: FavState = {
  view: "grid",
  favProducts: savedFavs ? JSON.parse(savedFavs) : [],
};

const FavSlice = createSlice({
  name: "fav",
  initialState,
  reducers: {
    toggleFavView(state) {
      state.view = state.view === "grid" ? "horizontal" : "grid";
    },

    toggleFav(state, action: PayloadAction<IProduct>) {
      const found = state.favProducts.some((p) => p.id === action.payload.id);

      if (!found) {
        state.favProducts.push(action.payload);
      } else {
        state.favProducts = state.favProducts.filter(
          (product) => product.id !== action.payload.id
        );
      }

      localStorage.setItem("favProducts", JSON.stringify(state.favProducts));
    },

    clearFav(state) {
      state.favProducts = [];
      localStorage.removeItem("favProducts");
    },
  },
});

export const { toggleFavView, toggleFav, clearFav } = FavSlice.actions;
export default FavSlice.reducer;

export const isInFavSelector = (state: RootState, productId: string) =>
  state.fav.favProducts.some((p) => p.id === productId);
