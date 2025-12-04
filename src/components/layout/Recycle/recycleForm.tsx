"use client";

import React, { useState, useTransition } from "react";
import { useForm, UseFormRegisterReturn, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { 
  ChevronDown, 
  Minus, 
  Plus,
  Loader2,
  User,
  MapPin,
  Package,
  X
} from "lucide-react";

// --- Types ---

type RecycleFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  neighborhood: string;
  street: string;
  building: string;
  floor: string;
  apartment: string;
  type: string;
};

type MaterialItem = {
  id: number;
  type: string;
  amount: number;
};

// --- Helper Components ---

// Input Component
type InputProps = {
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

const Input = ({ label, register, required, placeholder, error, type = 'text', icon: Icon, maxLength, onInput, className = "" }: InputProps) => (
  <div className="flex flex-col space-y-2 w-full">
    <label className="text-xs font-bold uppercase tracking-wider opacity-90 ml-2 text-primary-foreground">
      {label} {required && <span className="text-red-300">*</span>}
    </label>
    
    <div className="relative w-full group">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black z-10 pointer-events-none transition-colors" />
      )}
      <input
        {...register}
        placeholder={placeholder}
        type={type}
        maxLength={maxLength}
        onInput={onInput}
        className={`
          myInput 
          w-full p-3 rounded-full outline-none transition-all duration-300
          bg-primary-foreground/20 text-primary-foreground placeholder:text-foreground border border-primary-foreground/20
          focus:ring-2 focus:ring-primary-foreground/50 focus:border-primary-foreground
          hover:shadow-lg hover:ring-2 hover:ring-primary-foreground/30
          ${Icon ? 'pl-12!' : 'pl-4'}
          ${error ? 'ring-2! ring-red-400! border-red-400!' : ''}
          ${className}
        `}
      />
    </div>
    {error && (
      <span className="text-[11px] text-red-100 font-bold ml-2 bg-red-500/20 px-2 py-0.5 rounded-md inline-block w-fit">{error}</span>
    )}
  </div>
);

// Select Component
type SelectProps = {
  label: string;
  options: string[];
  register: UseFormRegisterReturn;
  error?: string;
};

const SelectField = ({
  label,
  options,
  register,
  error,
}: SelectProps) => (
  <div className="flex flex-col space-y-2 w-full">
    <label className="text-xs font-bold uppercase tracking-wider opacity-90 ml-2 text-primary-foreground">
      {label}
    </label>
    <div className="relative w-full group">
      <select
        {...register}
        defaultValue=""
        className={`
          myInput w-full p-3 pl-4 pr-10 rounded-full outline-none appearance-none cursor-pointer
          bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/20
          focus:ring-2 focus:ring-primary-foreground/50 focus:border-primary-foreground
          hover:shadow-lg hover:ring-2 hover:ring-primary-foreground/30 transition-all duration-300
          ${error ? 'ring-2! ring-red-400! border-red-400!' : ''}
        `}
      >
        <option value="" disabled className="text-foreground bg-primary">Select an option</option>
        {options.map((o) => (
          <option key={o} value={o} className="text-primary-foreground bg-primary">
            {o}
          </option>
        ))}
      </select>
      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary-foreground/60 transition-colors" />
    </div>
    {error && (
      <span className="text-[11px] text-red-100 font-bold ml-2 bg-red-500/20 px-2 py-0.5 rounded-md inline-block w-fit">{error}</span>
    )}
  </div>
);

// --- Main Form Component ---

const RecycleForm = () => {
  const [materials, setMaterials] = useState<MaterialItem[]>([{ id: 1, type: "", amount: 1 }]);
  const [isPending] = useTransition();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting: isHookFormSubmitting },
    reset 
  } = useForm<RecycleFormValues>();

  const addMaterial = () => {
    setMaterials([...materials, { id: Date.now(), type: "", amount: 1 }]);
  };

  const removeMaterial = (id: number) => {
    if (materials.length > 1) {
      setMaterials(materials.filter(m => m.id !== id));
    }
  };

  const onSubmit: SubmitHandler<RecycleFormValues> = async (data) => {
    // Manual validation for material types since zod is removed
    if (materials.some(m => !m.type)) {
        console.error("Please select a material type for all items.");
        return; 
    }
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log({ ...data, materials });
    console.log("Request submitted successfully!"); 
    reset();
    setMaterials([{ id: 1, type: "", amount: 1 }]);
  };

  const isSubmitting = isPending || isHookFormSubmitting;

  const handleNumberInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    input.value = input.value.replace(/[^0-9]/g, '');
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col items-center justify-center py-20">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-[80%] max-w-7xl mx-auto"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-12 bg-primary text-primary-foreground p-8 md:p-16 rounded-[3rem] border-4 border-primary-foreground/20 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-extrabold tracking-tight text-primary-foreground drop-shadow-sm">
              Recycle Request
            </h2>
            <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto font-medium">
              Schedule your pickup. We handle eco-friendly products and gifts made with love for our planet.
            </p>
          </div>

          <div className="space-y-10">
            {/* Personal Details Group */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b-2 border-primary-foreground/30 opacity-90">
                <User className="w-6 h-6 text-primary-foreground" /> 
                <span className="text-sm font-extrabold uppercase tracking-widest text-primary-foreground">Personal Info</span>
              </div>
              
              {/* Added Div Container for Personal Information */}
              <div className="bg-primary-foreground/10 p-8 rounded-3xl border border-primary-foreground/20 shadow-inner space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <Input label="First Name" register={register("firstName", { required: "Required" })} error={errors.firstName?.message} required icon={User} placeholder="First name" />
                  <Input label="Last Name" register={register("lastName", { required: "Required" })} error={errors.lastName?.message} required icon={User} placeholder="Last name" />
                  <Input label="Email" register={register("email", { required: "Required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} error={errors.email?.message} required icon={User} placeholder="example@email.com" />
                  
                  {/* Phone Input */}
                  <div className="flex flex-col space-y-2 w-full">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-90 ml-2 text-primary-foreground">
                      Phone Number <span className="text-red-300">*</span>
                    </label>
                    <div className="flex gap-4">
                      {/* Country Code */}
                      <div className="w-24 flex items-center justify-center rounded-full bg-primary-foreground/20 text-primary-foreground font-bold text-lg shadow-sm border border-primary-foreground/20">
                        +20
                      </div>
                      {/* Phone Number Field */}
                      <div className="flex-1">
                         <input
                            {...register("phone", { required: "Required", minLength: { value: 10, message: "10 digits required" } })}
                            placeholder="1234567890"
                            type="tel"
                            maxLength={10}
                            onInput={handleNumberInput}
                            className={`
                              w-full p-3 pl-6 rounded-full outline-none transition-all duration-300
                              bg-primary-foreground/20 text-primary-foreground placeholder:text-foreground border border-primary-foreground/20
                              focus:ring-2 focus:ring-primary-foreground/50 focus:border-primary-foreground
                              hover:shadow-lg hover:ring-2 hover:ring-primary-foreground/30
                              ${errors.phone ? 'ring-2 ring-red-400 border-red-400' : ''}
                            `}
                          />
                         {errors.phone && (
                          <span className="text-[11px] text-red-100 font-bold ml-2 bg-red-500/20 px-2 py-0.5 rounded-md inline-block w-fit mt-1">{errors.phone.message}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Group */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b-2 border-primary-foreground/30 opacity-90">
                <MapPin className="w-6 h-6 text-primary-foreground" /> 
                <span className="text-sm font-extrabold uppercase tracking-widest text-primary-foreground">Address Details</span>
              </div>
              
              <div className="bg-primary-foreground/10 p-8 rounded-3xl border border-primary-foreground/20 shadow-inner space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <Input label="City" register={register("city", { required: "Required" })} error={errors.city?.message} required icon={MapPin} placeholder="City" />
                  <Input label="Neighborhood" register={register("neighborhood", { required: "Required" })} error={errors.neighborhood?.message} required icon={MapPin} placeholder="Neighborhood" />
                </div>
                <div>
                  <Input label="Street" register={register("street", { required: "Required" })} error={errors.street?.message} required icon={MapPin} placeholder="Street address" />
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <Input label="Building" register={register("building", { required: "Required" })} error={errors.building?.message} required icon={MapPin} placeholder="No." />
                  <Input label="Floor" register={register("floor", { required: "Required" })} error={errors.floor?.message} required icon={MapPin} placeholder="No." />
                  <Input label="Apartment" register={register("apartment", { required: "Required" })} error={errors.apartment?.message} required icon={MapPin} placeholder="No." />
                </div>
              </div>
            </div>

            {/* Recycling Details Group */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b-2 border-primary-foreground/30 opacity-90">
                <Package className="w-6 h-6 text-primary-foreground" /> 
                <span className="text-sm font-extrabold uppercase tracking-widest text-primary-foreground">Recycling Info</span>
              </div>

              <div className="bg-primary-foreground/10 p-8 rounded-3xl border border-primary-foreground/20 shadow-inner space-y-8">
                {materials.map((material, index) => (
                  <div key={material.id} className=" space-y-6 relative transition-transform hover:scale-[1.01]">
                    {materials.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMaterial(material.id)}
                        className="absolute top-4 right-4 p-2 bg-red-500/20 text-red-100 hover:bg-red-500/40 rounded-full transition shadow-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    
                    <div className="text-sm font-bold text-primary-foreground/70 uppercase tracking-wider">Material Item {index + 1}</div>
                    
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                      <SelectField
                        label="Type"
                        options={["Plastic", "Paper", "Glass", "Electronic Waste", "Metal"]}
                        register={register("type")} 
                        error={errors.type?.message}
                      />
                      <div className="flex flex-col space-y-2 w-full">
                        <label className="text-xs font-bold uppercase tracking-wider opacity-90 ml-2 text-primary-foreground">Est. Weight (kg)</label>
                        <div className="flex items-center justify-between rounded-full bg-primary-foreground/10 p-1.5 border border-primary-foreground/20 shadow-inner h-[52px]">
                          <button
                            type="button"
                            onClick={() => {
                              const newMaterials = [...materials];
                              newMaterials[index].amount = Math.max(1, newMaterials[index].amount - 1);
                              setMaterials(newMaterials);
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all shadow-sm active:scale-90 border border-primary-foreground/20"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="font-mono text-xl font-bold text-primary-foreground w-12 text-center">{material.amount}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newMaterials = [...materials];
                              newMaterials[index].amount += 1;
                              setMaterials(newMaterials);
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all shadow-sm active:scale-90 border border-primary-foreground/20"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Material Button */}
                <button
                  type="button"
                  onClick={addMaterial}
                  className="w-full md:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-full font-bold transition-all duration-200
                   bg-primary-foreground text-primary border-2 border-primary-foreground/20 hover:bg-primary-foreground/90 active:scale-[0.98] shadow-md"
                >
                  <Plus size={20} />
                  Add Another Item
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 text-xl font-extrabold tracking-wide rounded-full
              bg-primary-foreground text-primary border-4 border-primary-foreground/50 hover:border-foreground shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform transition-all active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> Processing Request...
                </>
              ) : (
                "Submit Recycling Request"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RecycleForm;