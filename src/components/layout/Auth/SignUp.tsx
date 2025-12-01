"use client";
import Stepper, { Step } from "@/components/Stepper";
import { toggleAuthView, registerUser } from "@/frontend/redux/Slice/AuthSlice";
import { AppDispatch, RootState } from "@/frontend/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Step1 from "./Steps/Step1";
import UStep2 from "./Steps/user/UStep2";
import LastStep from "./Steps/LastStep";
import ShStep2 from "./Steps/shop/ShStep2";
import ShStep3 from "./Steps/shop/ShStep3";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
type StepKey = "step1" | "step2" | "step3" | "step4";

const SignUp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedType, stepsValidation, step2Data, step3Data, step4Data, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();

  const handleToggle = () => {
    dispatch(toggleAuthView());
  };

  const [currentStep, setCurrentStep] = useState(1);

  const stepOrder = useMemo<StepKey[]>(() => {
    if (selectedType === "shop") {
      return ["step1", "step2", "step3", "step4"];
    }
    return ["step1", "step2", "step4"];
  }, [selectedType]);

  const currentStepKey = stepOrder[currentStep - 1] ?? "step4";
  const currentStepValid = stepsValidation[currentStepKey];

  const handleComplete = async () => {
    const registrationData = {
      role: selectedType === "shop" ? "restaurant" : selectedType === "eventOrganizer" ? "organizer" : "customer",
      ...step2Data,
      ...step3Data,
      ...step4Data,
    };

    const resultAction = await dispatch(registerUser(registrationData));
    if (registerUser.fulfilled.match(resultAction)) {
      router.push('/');
    }
  };

  return (
    <div className="">
      <Stepper
        initialStep={1}
        onStepChange={(step) => setCurrentStep(step)}
        isStepValid={currentStepValid}
        onFinalStepCompleted={handleComplete}
        nextButtonProps={{ disabled: loading }}
        nextButtonText={loading ? "Registering..." : "Continue"}
      >
        <Step>
          <Step1 />
        </Step>
        {/* step 2 */}
        {(selectedType === "user" || selectedType === "eventOrganizer") && (
          <Step>
            <UStep2 />
          </Step>
        )}

        {selectedType === "shop" && (
          <Step>
            <ShStep2 />
          </Step>
        )}

        {/* step 3 */}

        {selectedType === "shop" && (
          <Step>
            <ShStep3 />
          </Step>
        )}
        <Step>
          <LastStep />
        </Step>
      </Stepper>
      <div className="flex sm:flex gap-5 flex-col p-5">
        <p className="text-center text-stone-700  space-x-1 sm:hidden ">
          <span>One of us ?</span>
          <button
            onClick={handleToggle}
            className="text-primary cursor-pointer"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
