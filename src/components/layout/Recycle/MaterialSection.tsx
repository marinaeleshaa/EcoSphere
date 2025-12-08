"use client";

import React from "react";
import { Package, Plus } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { type RecycleFormValues } from "@/frontend/schema/recycle.schema";
import ItemCard from "./UI/ItemCard";

type MaterialItem = {
  id: number;
  type: string;
  amount: number;
};

interface MaterialSectionProps {
  materials: MaterialItem[];
  removeMaterial: (id: number) => void;
  updateAmount: (index: number, delta: number) => void;
  register: UseFormRegister<RecycleFormValues>;
  addMaterial: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
}

const MaterialSection = ({
  materials,
  removeMaterial,
  updateAmount,
  register,
  addMaterial,
  errors,
}: MaterialSectionProps) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 pb-3 border-b-2 border-primary-foreground/30">
      <Package className="w-6 h-6" />
      <span className="text-sm font-extrabold uppercase">Recycling Info</span>
    </div>

    <div className="space-y-8">
      {materials.map((m: MaterialItem, index: number) => (
        <ItemCard
          key={m.id}
          item={m}
          index={index}
          total={materials.length}
          onRemove={removeMaterial}
          onAmountChange={updateAmount}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          register={register as unknown as (name: string) => any}
          error={errors[`type-${m.id}`]?.message as string | undefined}
        />
      ))}

      <button
        type="button"
        onClick={addMaterial}
        className="w-full md:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-full font-bold bg-primary-foreground text-primary border hover:bg-primary-foreground/90"
      >
        <Plus size={20} /> Add Another Item
      </button>
    </div>
  </div>
);

export default MaterialSection;
