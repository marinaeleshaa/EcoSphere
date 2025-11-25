import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  active: "login" | "register";
  selectedType: "user" | "eventOrganizer" | "shop";
}

// const savedFavs = typeof window !== "undefined" ? localStorage.getItem("favProducts") : null;

const initialState: AuthState = {
  active: "login",
  selectedType: "user",
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleAuthView(state) {
      state.active = state.active === "login" ? "register" : "login";
    },
    selectTypeAction(state, action) {
      state.selectedType = action.payload;
    },
  },
});

export const { toggleAuthView , selectTypeAction } = AuthSlice.actions;
export default AuthSlice.reducer;
