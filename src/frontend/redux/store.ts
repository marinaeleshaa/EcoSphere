import { configureStore } from "@reduxjs/toolkit";
import FavSlice from "./Slice/FavSlice";

export const store = configureStore({
  reducer: {
    fav:FavSlice,
  },
});

// Types (مهمين للـ TS)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;