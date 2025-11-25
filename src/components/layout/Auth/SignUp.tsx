"use client";
import Stepper, { Step } from "@/components/Stepper";
import { toggleAuthView } from "@/frontend/redux/Slice/AuthSlice";
import { AppDispatch, RootState } from "@/frontend/redux/store";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import Step1 from "./Steps/Step1";
import UStep2 from "./Steps/user/UStep2";
import UStep3 from "./Steps/user/UStep3";

const SignUp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedType } = useSelector((state: RootState) => state.auth);
  const handleToggle = () => {
    dispatch(toggleAuthView());
  };
  return (
    <div className="">
      <Stepper initialStep={1}>
        <Step>
          <Step1 />
        </Step>
        {selectedType === "user" && (
          <Step>
            <UStep2 />
          </Step>
        )}
        {selectedType === "user" && (
          <Step>
            <UStep3 />
          </Step>
        )}
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
