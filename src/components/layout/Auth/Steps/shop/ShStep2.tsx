"use client";

import { saveStep2Data, setStepValid } from "@/frontend/redux/Slice/AuthSlice";
import { Step2ShopSchema } from "@/frontend/schema/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Z from "zod";

const ShStep2 = () => {
  const dispatch = useDispatch();

  const form = useForm<Z.infer<typeof Step2ShopSchema>>({
    resolver: zodResolver(Step2ShopSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      phoneNumber: "",
      hotline: "",
    },
  });

  const onSubmit = (data: Z.infer<typeof Step2ShopSchema>) => {
    dispatch(saveStep2Data(data));
  };

  useEffect(() => {
    dispatch(setStepValid({ step: 2, valid: form.formState.isValid }));
  }, [form.formState.isValid, dispatch]);

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="flex flex-col gap-5 p-5 text-foreground rounded-lg">
      <form
        action=""
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <p className="text-2xl md:text-3xl font-bold text-center text-secondary-foreground">
          Shop Details
        </p>
        <div>
          <input
            type="text"
            placeholder="Enter shop name"
            className=" myInput"
            {...register("name")}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <textarea
            placeholder="Description"
            className="myInput resize-none"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>
        <div>
          <input
            type="tel"
            placeholder="Phone Number"
            className="myInput"
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p className="text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>
        <div>
          <input
            type="tel"
            placeholder="Hotline"
            className="myInput"
            {...register("hotline")}
          />
          {errors.hotline && (
            <p className="text-red-500">{errors.hotline.message}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ShStep2;
