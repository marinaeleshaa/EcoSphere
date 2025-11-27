"use client";

import { saveStep3Data, setStepValid } from "@/frontend/redux/Slice/AuthSlice";
import { Step3ShopSchema } from "@/frontend/schema/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Z from "zod";

const ShStep3 = () => {
  const dispatch = useDispatch();

  const form = useForm<Z.infer<typeof Step3ShopSchema>>({
    resolver: zodResolver(Step3ShopSchema),
    mode: "onChange",
    defaultValues: {
      location: "",
      workingHours: "",
    },
  });

  const onSubmit = (data: Z.infer<typeof Step3ShopSchema>) => {
    dispatch(saveStep3Data(data));
  };

  useEffect(() => {
    dispatch(setStepValid({ step: 3, valid: form.formState.isValid }));
  }, [form.formState.isValid, dispatch]);

  const {
    register,
    control,
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

        {/* Logo upload */}
        <div>
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="myInput"
                name={field.name}
                ref={field.ref}
                onChange={(event) =>
                  field.onChange(event.target.files ?? undefined)
                }
              />
            )}
          />
          {errors.avatar && (
            <p className="text-red-500">{errors.avatar.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <input
            type="text"
            placeholder="Enter shop location"
            className="myInput"
            {...register("location")}
          />
          {errors.location && (
            <p className="text-red-500">{errors.location.message}</p>
          )}
        </div>

        {/* Working hours */}

        <div>
          <input
            type="text"
            placeholder="e.g., Mon-Fri 9:00 AM - 6:00 PM"
            className="myInput"
            {...register("workingHours")}
          />
          {errors.workingHours && (
            <p className="text-red-500">{errors.workingHours.message}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ShStep3;
