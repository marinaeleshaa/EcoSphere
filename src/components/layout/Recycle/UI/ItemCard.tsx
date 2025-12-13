import React from "react";
import { Minus, Plus, X } from "lucide-react";
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
  const typeRegistration = register(`type`);

  return (
    <div className="space-y-6 relative transition-transform hover:scale-[1.01] bg-primary-foreground/10 p-6 rounded-3xl border border-primary-foreground/20">
      {total > 1 && (
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="absolute top-4 right-4 p-2 bg-red-500/20 text-red-100 rounded-full hover:bg-red-500/40"
        >
          <X size={16} />
        </button>
      )}

      <div className="font-bold text-primary-foreground/80 uppercase">
        Material Item {index + 1}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <SelectField
          label="Type"
          options={[
            "Plastic",
            "Paper",
            "Glass",
            "Electronic Waste",
            "Metal",
            "Mixed",
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
          <label className="text-xs font-bold uppercase ml-2">
            Est. Weight (kg)
          </label>

          <div className="flex items-center justify-between p-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20">
            <button
              type="button"
              onClick={() => onAmountChange(index, -1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-foreground/20 text-primary-foreground border hover:bg-primary-foreground hover:text-primary"
            >
              <Minus size={18} />
            </button>

            <span className="font-mono font-bold text-xl w-12 text-center">
              {item.amount}
            </span>

            <button
              type="button"
              onClick={() => onAmountChange(index, +1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-foreground/20 text-primary-foreground border hover:bg-primary-foreground hover:text-primary"
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
