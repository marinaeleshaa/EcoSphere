import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export interface UserState {
  isLoggedIn: boolean;
  role: "customer" | "organizer" | "restaurant" | "shop" | null;
  
  // Common
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phoneNumber?: string;
  address?: string;
  birthDate?: string;
  gender?: string;

  // Customer specific
  points?: number;
  favoritesIds?: string[];
  cart?: any[]; // Define proper CartItem type if available
  paymentHistory?: any[]; // Define proper PaymentHistory type if available

  // Organizer specific
  subscriptionPeriod?: string;

  // Restaurant specific
  name?: string; // Restaurant name
  description?: string;
  location?: string;
  workingHours?: string;
  hotline?: number;
}

const initialState: UserState = {
  isLoggedIn: false,
  role: null,
};

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ id, data }: { id: string; data: Partial<UserState> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result.message || "Failed to update profile");
      }

      return result.data; // Assuming API returns { data: updatedUser }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload, isLoggedIn: true };
    },
    updateProfile: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    logout: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      return { ...state, ...action.payload };
    });
  },
});

export const { setUser, updateProfile, logout } = UserSlice.actions;
export default UserSlice.reducer;
