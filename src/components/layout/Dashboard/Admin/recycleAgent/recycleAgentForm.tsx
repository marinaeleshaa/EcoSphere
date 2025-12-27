"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { NewRecycleAgentFormData } from "@/types/recycleAgent";
import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewRecycleAgentFormData) => Promise<void> | void;
  isSubmitting: boolean;
}

const RecycleAgentForm: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const t = useTranslations("Admin.RecycleAgents");

  const [formData, setFormData] = useState<NewRecycleAgentFormData>({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    phoneNumber: "",
    role: "recycleAgent",
    agentType: "independent",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) =>
    password.length >= 8 &&
    /\d/.test(password) &&
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "phoneNumber") {
      const digits = value.replace(/\D/g, "").slice(0, 11);
      setFormData((prev) => ({ ...prev, phoneNumber: digits }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";

    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.birthDate) newErrors.birthDate = "Birth date is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Phone number is required";
    else if (formData.phoneNumber.length !== 11)
      newErrors.phoneNumber = "Phone number must be exactly 11 digits";
    else if (!formData.phoneNumber.startsWith("01"))
      newErrors.phoneNumber = "Phone number must start with 01";

    if (!formData.password) newErrors.password = "Password is required";
    else if (!validatePassword(formData.password))
      newErrors.password =
        "Password must be 8+ characters with at least 1 number and 1 special character";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    await onSubmit(formData);

    setFormData({
      firstName: "",
      lastName: "",
      birthDate: "",
      email: "",
      phoneNumber: "",
      agentType: "independent",
      role: "recycleAgent",
      password: "",
    });

    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary rounded-lg shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-foreground">
            {t("form.title")}
          </h2>
          <button
            onClick={onClose}
            className="bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:scale-105"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {[
            { name: "firstName", label: t("form.firstName"), type: "text" },
            { name: "lastName", label: t("form.lastName"), type: "text" },
            { name: "email", label: t("form.email"), type: "email" },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={(formData as any)[name]}
                placeholder={label}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 border rounded-lg bg-background ${
                  errors[name] ? "border-destructive" : "border-primary/20"
                }`}
              />
              {errors[name] && (
                <p className="text-destructive text-xs mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1">Birthdate</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border rounded-lg bg-background border-primary/20"
            />
            {errors.birthDate && (
              <p className="text-destructive text-xs mt-1">
                {errors.birthDate}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              inputMode="numeric"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleFormChange}
              maxLength={11}
              placeholder="01xxxxxxxxx"
              className={`w-full px-3 py-2 border rounded-lg bg-background ${
                errors.phoneNumber ? "border-destructive" : "border-primary/20"
              }`}
            />
            {errors.phoneNumber && (
              <p className="text-destructive text-xs mt-1">
                {errors.phoneNumber}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("form.password")}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              className={`w-full px-3 py-2 border rounded-lg bg-background ${
                errors.password ? "border-destructive" : "border-primary/20"
              }`}
            />
            {errors.password && (
              <p className="text-destructive text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-center  md:justify-end gap-2 ">
            <Button
              type="button"
              onClick={onClose}
              className=" cursor-pointer hover:scale-105"
              variant={"outline"}
            >
              {t("form.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="  cursor-pointer hover:scale-105"
            >
              {isSubmitting ? "Loading..." : t("form.submit")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecycleAgentForm;
