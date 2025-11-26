import { createSlice } from "@reduxjs/toolkit";

interface ISecondUserStep {
  firstName: string;
  lastName: string;
  birthDate: string;
  phoneNumber: number;
  gender: string;
}

interface ISecondShopStep {
  name: string;
  description: string;
  phoneNumber: number;
  hotline: number;
}

interface IThirdShopStep {
  avatar: unknown;
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
