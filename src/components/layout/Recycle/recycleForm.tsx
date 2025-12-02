"use client";

import React, { useState, useTransition } from "react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { 
  ChevronDown, 
  Minus, 
  Plus,
  Loader2,
  User,
  MapPin,
  Package
} from "lucide-react";
import { recycleFormSchema, RecycleFormValues } from '@/frontend/schema/form.schema';


// --- Helper Components ---

// Input Component (typed)
type InputProps = {
  label: string;
  register?: UseFormRegisterReturn;
  required?: boolean;
  placeholder?: string;
  error?: string;
  type?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const Input = ({ label, register, required, placeholder, error, type = 'text', icon: Icon }: InputProps) => (
      <div className="flex flex-col space-y-1.5 w-full">
        <label className="text-xs font-semibold uppercase tracking-wider opacity-70 ml-1">{label} {required && <span className="text-primary">*</span>}</label>
      <div className={`flex items-center h-11 rounded-xl px-4 bg-[var(--card)] border ${error ? 'border-red-500' : 'border-[var(--border)]'} transition-all` }>
        {Icon && <Icon className="mr-3 opacity-70 text-[var(--muted-foreground)]" />}
        <input
          {...register}
          placeholder={placeholder}
          type={type}
          className="flex-1 bg-transparent outline-none text-sm text-[var(--foreground)] placeholder:opacity-60"
        />
      </div>
      {error && (
        <span className="text-[10px] text-red-500 font-medium ml-1">{error}</span>
      )}
    </div>
  );

// 3. Reusable Select Component
const SelectField = ({
  label,
  options,
  register,
  error,
}: {
  label: string;
  options: string[];
  register?: UseFormRegisterReturn;
  error?: string;
}) => (
  <div className="flex flex-col space-y-1.5 w-full">
    <label className="text-xs font-semibold uppercase tracking-wider opacity-70 ml-1">{label}</label>
    <div className="relative">
      <select
        {...register}
        defaultValue="" // Fixed: Set defaultValue here instead of 'selected' on option
        className={`h-11 w-full rounded-xl px-4 bg-[var(--card)] border appearance-none pr-10 transition-all outline-none cursor-pointer text-foreground
          ${error 
            ? "border-red-500 focus:ring-2 focus:ring-red-500/20" 
            : "border-[var(--border)] focus:border-primary focus:ring-4 focus:ring-primary/10"
          }`}
      >
        <option value="" disabled>Select an option</option> {/* Fixed: Removed 'selected' attribute */}
        {options.map((o) => (
          <option key={o} value={o} className="bg-[var(--card)] text-[var(--foreground)]">
            {o}
          </option>
        ))}
      </select>
      <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
    </div>
    {error && (
      <span className="text-[10px] text-red-500 font-medium ml-1">{error}</span>
    )}
  </div>
);


// --- The Form Component (Refactored & Improved) ---

const RecycleForm = () => {
  const [quantity, setQuantity] = useState(1);
  const [isPending] = useTransition(); // Hook for server action state
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting: isHookFormSubmitting },
    reset 
  } = useForm<RecycleFormValues>({
    resolver: zodResolver(recycleFormSchema)
  });

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => Math.max(1, q - 1));

  const onSubmit = async (data: RecycleFormValues) => {
    // In Next.js 16, this would ideally be a Server Action
    // startTransition(async () => { await yourServerAction(data) });
    
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay
    console.log({ ...data, quantity });
    alert("Request submitted successfully!");
    reset();
    setQuantity(1);
  };

  const isSubmitting = isPending || isHookFormSubmitting;

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl bg-[var(--primary)] rounded-[2rem] shadow-2xl dark:shadow-[0_16px_0_rgba(0,0,0,0.45)] p-6 md:p-12 space-y-10 border-2 border-[var(--primary)]/20 relative overflow-hidden"
    >
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />
      {/* (metrics card uses recycle1.png; no top-right duplicate) */}

      {/* Header */}
      <div className="text-center space-y-3 relative z-10">
        <h2 className="text-4xl font-bold text-[var(--foreground)] tracking-tight">
          Recycle Request
        </h2>
        <p className="text-muted-foreground text-base max-w-lg mx-auto">
          Schedule your pickup. We handle eco-friendly products and gifts made with love for our planet.
        </p>
      </div>

      <div className="space-y-8 relative z-10">
        {/* Personal Details Group */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)] opacity-60">
             <User className="w-4 h-4" /> 
             <span className="text-xs font-bold uppercase tracking-widest">Personal Info</span>
           </div>
          <div className="grid md:grid-cols-2 gap-5">
            <Input label="Name" register={register("name")} error={errors.name?.message} required />
            <Input label="Email" register={register("email")} error={errors.email?.message} required />
            <div className="md:col-span-2">
              <Input label="Phone Number" register={register("phone")} error={errors.phone?.message} required />
            </div>
          </div>
        </div>

        {/* Address Group */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)] opacity-60">
             <MapPin className="w-4 h-4" /> 
             <span className="text-xs font-bold uppercase tracking-widest">Address Details</span>
           </div>
          <div className="bg-[var(--card)] p-5 rounded-xl border border-[var(--border)] shadow-sm">
            <div className="grid md:grid-cols-2 gap-5">
              <Input label="City" register={register("city")} error={errors.city?.message} required />
              <Input label="Neighborhood" register={register("neighborhood")} error={errors.neighborhood?.message} />
            </div>

            <div className="mt-4">
              <Input label="Street" register={register("street")} error={errors.street?.message} />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <Input label="Building" register={register("building")} />
              <Input label="Floor" register={register("floor")} />
              <Input label="Apt No." register={register("apartment")} />
            </div>
          </div>
        </div>

        {/* Recycling Details Group */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)] opacity-60">
             <Package className="w-4 h-4" /> 
             <span className="text-xs font-bold uppercase tracking-widest">Recycling Info</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <SelectField
              label="Material Type"
              options={["Plastic", "Paper", "Glass", "Electronic Waste", "Metal"]}
              register={register("type")}
              error={errors.type?.message}
            />

            <div className="flex flex-col space-y-1.5 w-full">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-70 ml-1">Amount (Est. kg)</label>
              <div className="flex items-center justify-between h-11 rounded-xl bg-[var(--input)] px-2 border border-[var(--border)] ring-offset-background transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
                <button
                  type="button"
                  onClick={decrease}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--primary)/20] hover:text-primary transition-colors active:scale-95"
                >
                  <Minus size={16} />
                </button>

                <span className="font-bold text-lg min-w-[3ch] text-center font-mono">{quantity}</span>

                <button
                  type="button"
                  onClick={increase}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--primary)/20] hover:text-primary transition-colors active:scale-95"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full h-14 bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-lg rounded-xl shadow-lg shadow-[var(--primary)/25] transition-all hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Processing...
          </>
        ) : (
          "Submit Request"
        )}
      </motion.button>
    </motion.form>
  );
};

