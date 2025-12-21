"use client";

import { useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface ResetPasswordProps {
  onPasswordReset: (newPass: string) => void;
}

export default function ResetPassword({ onPasswordReset }: ResetPasswordProps) {
  const t = useTranslations("ForgotPassword.resetPassword");

  const [step, setStep] = useState<"reset" | "success">("reset");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password validation
  const hasMinLength = newPass.length >= 8;
  const hasNumber = /\d/.test(newPass);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPass);
  const passValid = hasMinLength && hasNumber && hasSpecial;
  const match = newPass === confirm && confirm !== "";

  const handleSubmit = () => {
    if (!passValid || !match) return;
    setStep("success");
    setTimeout(() => {
      onPasswordReset(newPass);
    }, 3000);
  };

  const variants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <AnimatePresence mode="wait">
      {step === "reset" ? (
        // Step 1: Reset Password Form
        <motion.div
          key="reset"
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-extrabold text-3xl text-foreground">
              {t("title")}
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t("description")}
            </p>
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground">
              {t("newPassword.label")}
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder={t("newPassword.placeholder")}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="bg-input text-input-foreground p-3 rounded-full w-full border-2 border-border pr-12 focus:border-primary outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                aria-label={showPass ? t("hidePassword") : t("showPassword")}
              >
                {showPass ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            {/* Password Requirements */}
            {newPass && (
              <div className="text-xs space-y-1 mt-2">
                <div
                  className={`flex items-center gap-2 ${
                    hasMinLength ? "text-green-600" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      hasMinLength ? "bg-green-600" : "bg-muted-foreground"
                    }`}
                  />
                  {t("requirements.minLength")}
                </div>
                <div
                  className={`flex items-center gap-2 ${
                    hasNumber ? "text-green-600" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      hasNumber ? "bg-green-600" : "bg-muted-foreground"
                    }`}
                  />
                  {t("requirements.hasNumber")}
                </div>
                <div
                  className={`flex items-center gap-2 ${
                    hasSpecial ? "text-green-600" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      hasSpecial ? "bg-green-600" : "bg-muted-foreground"
                    }`}
                  />
                  {t("requirements.hasSpecial")}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground">
              {t("confirmPassword.label")}
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder={t("confirmPassword.placeholder")}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`bg-input text-input-foreground p-3 rounded-full w-full border-2 pr-12 outline-none transition ${
                  confirm && !match
                    ? "border-red-500"
                    : "border-border focus:border-primary"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                aria-label={showConfirm ? t("hidePassword") : t("showPassword")}
              >
                {showConfirm ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            {confirm && !match && (
              <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-lg mt-1">
                {t("confirmPassword.mismatch")}
              </p>
            )}
          </div>

          <button
            disabled={!passValid || !match}
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground font-bold p-3 rounded-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all mt-4"
          >
            {t("submitButton")} <IoIosArrowRoundForward className="text-2xl" />
          </button>
        </motion.div>
      ) : (
        // Step 2: Success Screen
        <motion.div
          key="success"
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col items-center text-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center"
            >
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </motion.div>
            <h2 className="font-extrabold text-3xl text-foreground">
              {t("success.title")}
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t("success.description")}
            </p>
          </div>

          <Link href="/auth" className="w-full">
            <button className="w-full bg-primary text-primary-foreground font-bold p-3 rounded-full flex items-center justify-center gap-2 hover:scale-105 transition-all">
              {t("success.button")}{" "}
              <IoIosArrowRoundForward className="text-2xl" />
            </button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
