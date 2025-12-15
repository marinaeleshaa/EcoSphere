"use client";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type FormInputProps = {
  label: string;
  register: UseFormRegisterReturn;
  required?: boolean;
  placeholder?: string;
  error?: string;
  type?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  maxLength?: number;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  className?: string;
};

const formInput = ({
  label,
  register,
  required,
  placeholder,
  error,
  type = "text",
  icon: Icon,
  maxLength,
  onInput,
  className = "",
}: FormInputProps) => (
  <div className="flex flex-col space-y-2 w-full">
    <label className="text-sm  font-bold uppercase ml-2 text-primary">
      {label} {required && <span className="text-red-500 ml-2">*</span>}
    </label>
    <div className="relative w-full">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black pointer-events-none" />
      )}
      <input
        {...register}
        placeholder={placeholder}
        type={type}
        maxLength={maxLength}
        onInput={onInput}
        className={`
          myInput 
          placeholder:text-foreground
          ${Icon ? "pl-12!" : "pl-4"}
          ${error ? "ring-2 ring-red-400 border-red-400" : ""}
          ${className}
        `}
      />
    </div>
    {error && (
      <span className="text-[11px] text-red-100 font-bold ml-2 bg-red-500/20 px-2 py-0.5 rounded-md w-fit">
        {error}
      </span>
    )}
  </div>
);

export default formInput;