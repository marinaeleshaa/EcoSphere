import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setUser, logout as logoutUser } from "./UserSlice";

interface ISecondUserStep {
  firstName: string;
  lastName: string;
  birthDate: string;
  phoneNumber: string;
  gender: string;
  address: string;
}

interface ISecondShopStep {
  name: string;
  description: string;
  phoneNumber: number;
  hotline: number;
}

interface IThirdShopStep {
  avatar: string;
  location: string;
  workingHours: string;
}

interface IFourthStep {
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthState {
  active: "login" | "register";
  selectedType: "user" | "eventOrganizer" | "shop";
  loading: boolean;
  error: string | null;

  step2Data: ISecondUserStep | ISecondShopStep;
  step3Data: IThirdShopStep;
  step4Data: IFourthStep;

  /** NEW — validation for each step */
  stepsValidation: {
    step1: boolean;
    step2: boolean;
    step3: boolean;
    step4: boolean;
  };
}

const initialState: AuthState = {
  active: "login",
  selectedType: "user",
  loading: false,
  error: null,
  step2Data: {} as ISecondUserStep,
  step3Data: {} as IThirdShopStep,
  step4Data: {} as IFourthStep,

  stepsValidation: {
    step1: false,
    step2: false,
    step3: false,
    step4: false,
  },
};

import { signIn, signOut } from "next-auth/react";

// Real Login Thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: any, { dispatch, rejectWithValue }) => {
    try {
      // Use NextAuth signIn
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        loginType: credentials.loginType || "customer",
        redirect: false,
      });

      if (result?.error) {
        return rejectWithValue(result.error);
      }

      if (!result?.ok) {
        return rejectWithValue("Login failed");
      }

      // Login successful, cookie is set.
      // Now fetch the full user profile using the custom API or just use what we have?
      // Since the custom API /api/login returns the full profile, and we want that in Redux,
      // we can EITHER:
      // 1. Call /api/login directly (as before) AND call signIn (double auth?) - Bad.
      // 2. Trust that signIn called the controller and set the cookie.
      //    But signIn response doesn't have the user data.
      
      // We need to fetch the user profile.
      // Let's call the original /api/login endpoint? 
      // No, that would try to log in again.
      
      // We need an endpoint to get the current user profile.
      // The user might not have one.
      
      // TEMPORARY SOLUTION:
      // Call /api/login to get the data for Redux, AND call signIn to set the cookie for Middleware.
      // It's inefficient but solves the immediate problem of "Middleware redirecting" + "Redux needing data".
      
      // 1. Call signIn to satisfy Middleware (sets cookie)
      // Already done above.
      
      // 2. Call /api/login to get data for Redux
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...credentials,
          loginType: credentials.loginType || "customer",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If this fails but signIn succeeded, it's weird.
        return rejectWithValue(data.message || "Login failed");
      }

      const userData = data.data?.user || data.user; // Handle both structures
      
      // Store token in localStorage as backup/for API calls if needed
      if (data.data?.token || data.token) {
          localStorage.setItem("token", data.data?.token || data.token);
      }

      dispatch(setUser({ ...userData, isLoggedIn: true }));
      return userData;
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

// Real Register Thunk
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (registrationData: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Registration failed");
      }

      const userData = data.data.user;
      localStorage.setItem("token", data.data.token);

      dispatch(setUser({ ...userData, isLoggedIn: true }));
      return userData;
    } catch (error: any) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

// Logout Thunk
export const logoutUserThunk = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Sign out from NextAuth (clears session cookie)
      await signOut({ redirect: false });

      // Clear token from localStorage
      localStorage.removeItem("token");

      // Clear user state in Redux
      dispatch(logoutUser());

      return { success: true };
    } catch (error: any) {
      // Even if signOut fails, clear local state
      localStorage.removeItem("token");
      dispatch(logoutUser());
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

type StepKey = "step1" | "step2" | "step3" | "step4";

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

    saveStep2Data(state, action) {
      state.step2Data = action.payload;
      state.stepsValidation.step2 = true; // VALID
    },

    saveStep3Data(state, action) {
      state.step3Data = action.payload;
      state.stepsValidation.step3 = true;
    },

    saveStep4Data(state, action) {
      state.step4Data = action.payload;
      state.stepsValidation.step4 = true;
    },

    setStepValid(state, action) {
      const { step, valid } = action.payload;

      const key = `step${step}` as StepKey;

      state.stepsValidation[key] = valid;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  toggleAuthView,
  selectTypeAction,
  saveStep2Data,
  saveStep3Data,
  saveStep4Data,
  setStepValid,
} = AuthSlice.actions;

export default AuthSlice.reducer;
