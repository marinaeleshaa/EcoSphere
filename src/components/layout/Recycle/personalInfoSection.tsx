"use client";

import React from "react";
import { User, Mail } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useTranslations } from "next-intl";
import { type RecycleFormValues } from "@/frontend/schema/recycle.schema";
import Input from "./UI/formInput";
import { FaPhoneAlt } from "react-icons/fa";

interface PersonalInfoSectionProps {
  register: UseFormRegister<RecycleFormValues>;
  errors: FieldErrors<RecycleFormValues>;
  handleNumberInput: (e: React.FormEvent<HTMLInputElement>) => void;
}

const PersonalInfoSection = ({
  register,
  errors,
  handleNumberInput,
}: PersonalInfoSectionProps) => {
  const t = useTranslations("RecycleForm.personalInfoSection");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-muted-foreground pb-3 border-b-2 border-primary/30">
        <User className="w-6 h-6" />
        <span className="text-sm font-bold uppercase ">{t("title")}</span>
      </div>

      <div className="border-2 border-primary/30  p-4 md:p-6 lg:p-8 rounded-3xl space-y-6">
        <div className="grid md:grid-cols-2 gap-8">
          <Input
            label={t("fields.firstName.label")}
            register={register("firstName")}
            error={errors.firstName?.message}
            required
            icon={User}
            placeholder={t("fields.firstName.placeholder")}
          />
          <Input
            label={t("fields.lastName.label")}
            register={register("lastName")}
            error={errors.lastName?.message}
            required
            icon={User}
            placeholder={t("fields.lastName.placeholder")}
          />

          <Input
            label={t("fields.email.label")}
            register={register("email")}
            error={errors.email?.message}
            placeholder={t("fields.email.placeholder")}
            icon={Mail}
            required
          />

          {/* Phone */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-bold uppercase text-primary">
              {t("fields.phone.label")}
              <span className="text-red-500 ml-2">*</span>
            </label>

            <div className="flex flex-col md:flex-row gap-4">
              {/* <div className="w-24 flex items-center justify-center rounded-full bg-input font-bold text-input-foreground">
              +20
            </div> */}

              <div className=" w-full">
                <div className="relative">
                  <input
                    {...register("phone")}
                    maxLength={11}
                    onInput={handleNumberInput}
                    placeholder={t("fields.phone.placeholder")}
                    required
                    className="myInput"
                  />
                  <FaPhoneAlt className="absolute top-[35%] text-primary-foreground left-3" />
                </div>

                {errors.phone && (
                  <span className="text-[11px] text-red-100 px-2 py-0.5 bg-red-500/20 rounded-md mt-1 inline-block">
                    {errors.phone.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
