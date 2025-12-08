"use client";

import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { ChevronDown } from "lucide-react";

type SelectProps = {
  label: string;
  options: string[];
  register: UseFormRegisterReturn;
  error?: string;
};

const SelectField = ({ label, options, register, error }: SelectProps) => (
  <div className="flex flex-col space-y-2 w-full">
    <label className="text-xs font-bold uppercase ml-2 text-primary-foreground">{label}</label>

    <div className="relative">
      <select
        {...register}
        defaultValue=""
        className={`
          myInput w-full p-3 pl-4 rounded-full bg-primary-foreground/20
          border border-primary-foreground/20 text-primary-foreground
          focus:ring-2 hover:shadow-lg transition-all
          appearance-none cursor-pointer
          ${error ? "ring-2 ring-red-400 border-red-400" : ""}
        `}
      >
        <option value="" disabled>Select an option</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>

      <ChevronDown
        size={18}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground/70"
      />
    </div>

    {error && (
      <span className="text-[11px] text-red-100 font-bold bg-red-500/20 px-2 py-0.5 rounded-md w-fit ml-2">
        {error}
      </span>
    )}
  </div>
);

export default SelectField;
