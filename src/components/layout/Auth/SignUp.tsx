"use client";
import { toggleAuthView, registerUser } from "@/frontend/redux/Slice/AuthSlice";
import Stepper, { Step } from "@/components/ui/Stepper";
import { AppDispatch, RootState } from "@/frontend/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Step1 from "./Steps/Step1";
import UStep2 from "./Steps/user/UStep2";
import LastStep from "./Steps/LastStep";
import ShStep2 from "./Steps/shop/ShStep2";
import ShStep3 from "./Steps/shop/ShStep3";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type StepKey = "step1" | "step2" | "step3" | "step4";

const SignUp = () => {
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const t = useTranslations("Auth.signup");
  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedType,
    stepsValidation,
    step2Data,
    step3Data,
    step4Data,
    loading,
  } = useSelector((state: RootState) => state.auth);
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
      role:
        selectedType === "shop"
          ? "shop"
          : selectedType === "eventOrganizer"
          ? "organizer"
          : "customer",
      ...step2Data,
      ...step3Data,
      ...step4Data,
    };

    const resultAction = await dispatch(registerUser(registrationData));
    if (registerUser.fulfilled.match(resultAction)) {
      setRegistrationSuccess(true);
      const response = await signIn("credentials", {
        email: step4Data.email,
        password: step4Data.password,
        redirect: false,
      });
      if (!response.error) router.push("/");
      toast.success(t("successRegister"));
    }
  };
  if (registrationSuccess) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-10 text-center">
        <div className="text-5xl">✅</div>
        <h2 className="text-2xl font-bold flex gap-2 items-center text-primary">
          {t("successRegister")} <Loader2 className="animate-spin" />
        </h2>
      </div>
    );
  }

  return (
    <div>
      <Stepper
        initialStep={1}
        onStepChange={(step) => setCurrentStep(step)}
        isStepValid={currentStepValid}
        onFinalStepCompleted={handleComplete}
        nextButtonProps={{ disabled: loading }}
        nextButtonText={loading ? t("registering") : t("continue")}
        className=""
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
          <Step >
            <ShStep3 />
          </Step>
        )}
        <Step>
          <LastStep />
        </Step>
      </Stepper>
      <div className="flex sm:flex gap-5 flex-col p-5">
        <p className="text-center text-stone-700  space-x-1 sm:hidden ">
          <span>{t("oneOfUs")}</span>
          <button
            onClick={handleToggle}
            className="text-primary cursor-pointer"
          >
            {t("login")}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
