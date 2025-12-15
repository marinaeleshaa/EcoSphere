"use client";
import React from "react";
import { Minus, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import SelectField from "./selectField";

type MaterialItem = {
  id: number;
  type: string;
  amount: number;
};

type Props = {
  item: MaterialItem;
  index: number;
  total: number;
  onRemove: (id: number) => void;
  onAmountChange: (index: number, delta: number) => void;
  onTypeChange: (index: number, newType: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: (name: string) => any;
  error?: string;
};

const ItemCard = ({
  item,
  index,
  total,
  onRemove,
  onAmountChange,
  onTypeChange,
  register,
  error,
}: Props) => {
  const t = useTranslations("RecycleForm.itemCard");
  const tMaterials = useTranslations("RecycleForm.materialTypes");

  const typeRegistration = register(`type`);

  return (
    <div className="space-y-6 relative transition-transform hover:scale-[1.01]  p-6 rounded-3xl border border-primary/30">
      {total > 1 && (
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="absolute top-4 right-4 p-2 bg-red-500/50 text-red-100 rounded-full hover:bg-red-500/60 cursor-pointer transition duration-400 "
        >
          <X size={16} />
        </button>
      )}
      <div className="font-bold text-primary/80 uppercase">
        {t("title", { number: index + 1 })}
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <SelectField
          label={t("typeLabel")}
          options={[
            tMaterials("plastic"),
            tMaterials("paper"),
            tMaterials("glass"),
            tMaterials("electronic"),
            tMaterials("metal"),
            tMaterials("mixed"),
          ]}
          register={{
            ...typeRegistration,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
              typeRegistration.onChange(e);
              onTypeChange(index, e.target.value);
            },
          }}
          error={error}
        />
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase ml-2">
            {t("weightLabel")}
          </label>

          <div className="flex items-center justify-between p-2 rounded-full border border-primary/50 ">
            <button
              type="button"
              onClick={() => onAmountChange(index, -1)}
              className="w-10 h-10 flex items-center text-primary-foreground justify-center bg-primary rounded-full transition duration-400 hover:scale-102  text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-2"
            >
              <Minus size={18} />
            </button>

            <span className=" font-bold text-primary text-xl w-12 text-center">
              {item.amount}
            </span>
            <button
              type="button"
              onClick={() => onAmountChange(index, +1)}
              className="w-10 h-10 flex items-center text-primary-foreground justify-center bg-primary rounded-full transition duration-400 hover:scale-102  text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-2"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;