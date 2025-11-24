import { IProduct } from "@/types/ProductType";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../Store";
interface FavState {
  view: "grid" | "horizontal";
  favProducts: IProduct[];
}
const initialState: FavState = { view: "grid", favProducts: [] };
const FavSlice = createSlice({
  name: "fav",
  initialState,
  reducers: {
    toggleFavView(state) {
      state.view = state.view === "grid" ? "horizontal" : "grid";
    },
    addFavProduct(state, action) {
      state.favProducts.push(action.payload);
    },
    removeFavProduct(state, action) {
      state.favProducts = state.favProducts.filter(
        (product) => product.id !== action.payload
      );
    },
    clearFav(state) {
      state.favProducts = [];
    },
  },
});

export const { toggleFavView, addFavProduct, removeFavProduct } =
  FavSlice.actions;
export default FavSlice.reducer;

export const isInFavSelector = (state: RootState, productId: string) =>
  state.fav.favProducts.some((p) => p.id === productId);
