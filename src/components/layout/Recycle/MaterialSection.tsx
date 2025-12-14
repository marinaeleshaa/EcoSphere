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
  updateType: (index: number, newType: string) => void;
  register: UseFormRegister<RecycleFormValues>;
  addMaterial: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
}

const MaterialSection = ({
  materials,
  removeMaterial,
  updateAmount,
  updateType,
  register,
  addMaterial,
  errors,
}: MaterialSectionProps) => (
  <div className="space-y-6">
    <div className="flex  items-center text-muted-foreground gap-3 pb-3 border-b-2 border-primary/30">
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
          onTypeChange={updateType}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          register={register as unknown as (name: string) => any}
          error={errors[`type-${m.id}`]?.message as string | undefined}
        />
      ))}

      <button
        type="button"
        onClick={addMaterial}
        className="w-full md:w-auto bg-background text-primary border-2 border-primary p-3 px-5 rounded-full transition duration-400 hover:scale-102 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-4 hover:bg-primary hover:text-primary-foreground cursor-pointer"
      >
        <Plus size={20} /> Add Item
      </button>
    </div>
  </div>
);

export default MaterialSection;
