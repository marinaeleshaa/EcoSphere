"use client";

import { selectTypeAction, setStepValid } from "@/frontend/redux/Slice/AuthSlice";
import { AppDispatch } from "@/frontend/redux/store";
import { useDispatch } from "react-redux";

const Step1 = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSelect = (type: "user" | "eventOrganizer" | "shop") => {
    dispatch(selectTypeAction(type));
    dispatch(setStepValid({ step: 1, valid: true })); // mark step1 as valid
  };

  return (
    <div className="flex flex-col text-foreground rounded-lg p-5 gap-5">
      <p className="text-secondary-foreground text-center text-2xl md:text-3xl font-bold">
        Sign Up 
      </p>
      <button
        className="bg-primary text-primary-foreground p-3 rounded-full transition duration-400 hover:scale-102 flex justify-center items-center text-lg gap-2 focus:outline-2 focus:outline-primary focus:outline-offset-4 capitalize cursor-pointer"
        onClick={() => handleSelect("user")}
      >
        normal user
      </button>
      <button
        className="bg-primary text-primary-foreground p-3 rounded-full transition duration-400 focus:scale-102 flex justify-center items-center text-lg gap-2 focus:outline-2 focus:outline-primary focus:outline-offset-4 capitalize cursor-pointer"
        onClick={() => handleSelect("eventOrganizer")}
      >
        event organizer
      </button>
      <button
        className="bg-primary text-primary-foreground p-3 rounded-full transition duration-400 focus:scale-102 flex justify-center items-center text-lg gap-2 focus:outline-2 focus:outline-primary focus:outline-offset-4 capitalize cursor-pointer"
        onClick={() => handleSelect("shop")}
      >
        shop
      </button>
    </div>
  );
};

export default Step1;
