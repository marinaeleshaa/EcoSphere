"use client";

import { saveStep3Data, setStepValid } from "@/frontend/redux/Slice/AuthSlice";
import { Step3ShopSchema } from "@/frontend/schema/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Z from "zod";
import { useTranslations } from "next-intl";
import { CategoryOptionClient } from "@/types/ShopTypes";

const ShStep3 = () => {
  const t = useTranslations("Auth.steps.shopStep3");
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories: CategoryOptionClient[] = [
    "supermarket",
    "hypermarket",
    "grocery",
    "bakery",
    "cafe",
    "other",
  ];

  const form = useForm<Z.infer<typeof Step3ShopSchema>>({
    resolver: zodResolver(Step3ShopSchema),
    mode: "onChange",
    defaultValues: {
      category: undefined,
      location: "",
      workingHours: "",
    },
  });

  const onSubmit = (data: Z.infer<typeof Step3ShopSchema>) => {
    dispatch(saveStep3Data(data));
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      dispatch(saveStep3Data(value));
    });
    return () => subscription.unsubscribe();
  }, [form.watch, dispatch, form]);

  useEffect(() => {
    dispatch(setStepValid({ step: 3, valid: form.formState.isValid }));
  }, [form.formState.isValid, dispatch]);

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const selectedCategory = watch("category");

  const handleCategorySelect = (category: CategoryOptionClient) => {
    setValue("category", category, { shouldValidate: true });
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col gap-5 px-5 py-10 text-foreground rounded-lg h-[60vh]!">
      <form
        action=""
        className="flex flex-col gap-5 "
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <p className="text-2xl md:text-3xl font-bold text-center text-secondary-foreground">
          {t("title")}
        </p>

        {/* Category Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="myInput w-full text-left flex justify-between items-center cursor-pointer"
          >
            <span className={selectedCategory ? "" : "text-gray-400"}>
              {selectedCategory
                ? t(`categories.${selectedCategory}`)
                : t("selectCategory")}
            </span>
            <svg
              className={`w-5 h-5 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute  z-10 w-full mt-1 bg-background  border border-primary rounded-md shadow-lg max-h-60 overflow-y-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full text-left px-4 py-2 hover:bg-primary/25 transition-colors cursor-pointer ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground font-medium"
                      : ""
                  }`}
                >
                  {t(`categories.${category}`)}
                </button>
              ))}
            </div>
          )}

          {errors.category && (
            <p className="text-red-500 mt-1">{errors.category.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <input
            type="text"
            placeholder={t("location")}
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
            placeholder={t("workingHours")}
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
