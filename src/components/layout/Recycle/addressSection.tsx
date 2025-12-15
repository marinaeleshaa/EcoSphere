"use client";

import {
  MapPin,
  Building2,
  StretchHorizontal,
  DoorClosed,
  Rows4,
  Sparkles,
} from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useTranslations } from "next-intl";
import { type RecycleFormValues } from "@/frontend/schema/recycle.schema";
import Input from "./UI/formInput";

interface AddressSectionProps {
  register: UseFormRegister<RecycleFormValues>;
  errors: FieldErrors<RecycleFormValues>;
}

const AddressSection = ({ register, errors }: AddressSectionProps) => {
  const t = useTranslations("RecycleForm.addressSection");

  return (
    <div className="space-y-6">
      <div className="flex items-center text-muted-foreground gap-3 pb-3 border-b-2 border-primary/30">
        <MapPin className="w-6 h-6" />
        <span className="text-sm font-extrabold uppercase">{t("title")}</span>
      </div>

      <div className=" p-4 md:p-6 lg:p-8 rounded-3xl border-2 border-primary/30  space-y-6">
        <div className="grid md:grid-cols-2 gap-8">
          <Input
            label={t("fields.city.label")}
            register={register("city")}
            error={errors.city?.message}
            icon={MapPin}
            placeholder={t("fields.city.placeholder")}
            required
          />
          <Input
            label={t("fields.neighborhood.label")}
            register={register("neighborhood")}
            error={errors.neighborhood?.message}
            icon={Sparkles}
            placeholder={t("fields.neighborhood.placeholder")}
            required
          />
        </div>

        <Input
          label={t("fields.street.label")}
          register={register("street")}
          error={errors.street?.message}
          icon={StretchHorizontal}
          placeholder={t("fields.street.placeholder")}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3  gap-6">
          <Input
            label={t("fields.building.label")}
            register={register("building")}
            error={errors.building?.message}
            icon={Building2}
            placeholder={t("fields.building.placeholder")}
            required
          />
          <Input
            label={t("fields.floor.label")}
            register={register("floor")}
            error={errors.floor?.message}
            icon={Rows4}
            placeholder={t("fields.floor.placeholder")}
            required
          />
          <Input
            label={t("fields.apartment.label")}
            register={register("apartment")}
            error={errors.apartment?.message}
            icon={DoorClosed}
            placeholder={t("fields.apartment.placeholder")}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
