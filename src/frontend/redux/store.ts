import { configureStore } from "@reduxjs/toolkit";
import FavSlice from "./Slice/FavSlice";
import AuthSlice from "./Slice/AuthSlice";
import UserSlice from "./Slice/UserSlice";

export const store = configureStore({
  reducer: {
    fav: FavSlice,
    auth: AuthSlice,
    user: UserSlice,
  },
});

// Types (مهمين للـ TS)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
