import { createSlice } from "@reduxjs/toolkit";
interface FavState {
  view: "grid" | "horizontal";
}
const initialState: FavState = { view: "grid" };
const FavSlice = createSlice({
  name: "fav",
  initialState,
  reducers: {
    toggleFavView(state) {
      state.view = state.view === "grid" ? "horizontal" : "grid";
    },
  },
});

export const {toggleFavView} = FavSlice.actions;
export default FavSlice.reducer;
