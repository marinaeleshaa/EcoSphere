"use client";

import { useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface ResetPasswordProps {
  onPasswordReset?: (email: string) => void;
  isLoading?: boolean;
  error?: string;
}

const ResetPassword = ({
  onPasswordReset,
  isLoading = false,
  error = "",
}: ResetPasswordProps) => {
  const t = useTranslations("Auth.forgotPassword");
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setPasswordMatch(e.target.value === confirmPassword);
    // Validate password requirements whenever it changes
    const val = e.target.value;
    const hasNumber = /[0-9]/.test(val);
    const hasSpecial = /[^A-Za-z0-9]/.test(val);
    const minLength = val.length >= 8;
    setPasswordValid(hasNumber && hasSpecial && minLength);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(newPassword === e.target.value);
  };

  const handleResetPassword = async () => {
    if (!emailValid || !newPassword || !confirmPassword) return;
    if (!passwordMatch || !passwordValid) return;

    // TODO: Call your password reset API here
    // await resetPassword({
    //   email,
    //   verificationCode,
    //   newPassword,
    // });

    setIsPasswordReset(true);
    onPasswordReset?.(email);
  };

  if (isPasswordReset) {
    return (
      <div className="flex sm:flex gap-5 flex-col">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="capitalize text-center font-extrabold text-secondary-foreground text-2xl">
            {t("passwordResetSuccess")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {t("passwordResetSuccessMessage")}
          </p>
        </div>

        <Link href="/auth">
          <button className="w-full bg-primary text-primary-foreground p-3 rounded-full transition duration-400 hover:scale-105 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-4">
            {t("backToLogin")}
            <IoIosArrowRoundForward />
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex sm:flex gap-5 flex-col">
      <p className="capitalize text-center font-extrabold mb-5 text-secondary-foreground text-4xl">
        {t("resetPassword")}
      </p>

      <p className="text-center text-muted-foreground text-sm">
        {t("enterEmailDescription")}
      </p>

      {error && <p className="text-red-500 text-center text-sm">{error}</p>}

      {/* Email Input */}
      <input
        type="email"
        placeholder={t("email")}
        value={email}
        onChange={(e) => {
          const value = e.target.value;
          setEmail(value);
          const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          setEmailValid(isValid);
        }}
        className={`bg-input text-input-foreground p-3 rounded-full transition duration-300 focus:outline-none pl-10 ${email && !emailValid ? "border-2 border-red-500" : ""}`}
      />

      {email && !emailValid && (
        <p className="text-red-500 text-sm text-center">Please enter a valid email address.</p>
      )}

      {/* (No verification code input - code is sent after reset) */}
      {/* New Password Input */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={t("newPassword")}
          value={newPassword}
          onChange={handlePasswordChange}
          className={`bg-input text-input-foreground w-full p-3 rounded-full transition duration-300 focus:outline-none pl-10 pr-12 ${newPassword && !passwordValid ? "border-2 border-red-500" : ""}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 cursor-pointer -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? (
            <Eye size={20} className="text-black" />
          ) : (
            <EyeOff size={20} className="text-black" />
          )}
        </button>
      </div>

      {newPassword && !passwordValid && (
        <p className="text-red-500 text-sm text-center">Password must be at least 8 characters and include a number and a special character.</p>
      )}

      {/* Confirm Password Input */}
      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder={t("confirmPassword")}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          className={`bg-input text-input-foreground w-full p-3 rounded-full transition duration-300 focus:outline-none pl-10 pr-12 ${confirmPassword && !passwordMatch ? "border-2 border-red-500" : ""}`}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-4 top-1/2 cursor-pointer -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showConfirmPassword ? (
            <Eye size={20} className="text-black" />
          ) : (
            <EyeOff size={20} className="text-black" />
          )}
        </button>
      </div>

      {confirmPassword && !passwordMatch && (
        <p className="text-red-500 text-sm text-center">{t("passwordsDoNotMatch")}</p>
      )}

      <button
        onClick={handleResetPassword}
        disabled={isLoading || !emailValid || !passwordValid || !passwordMatch}
        className="bg-primary text-primary-foreground p-3 rounded-full transition duration-400 hover:scale-105 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-4 disabled:opacity-50"
      >
        {isLoading ? t("resettingPassword") + "..." : t("resetPassword")}
        {!isLoading && <IoIosArrowRoundForward />}
      </button>

      <Link href="/auth">
        <p className="text-center text-stone-600 space-x-1">
          <span>{t("rememberPassword")}</span>
          <button className="text-primary cursor-pointer font-semibold">
            {t("login")}
          </button>
        </p>
      </Link>
    </div>
  );
};

export default ResetPassword;
