"use client";

import { IoIosArrowRoundForward } from "react-icons/io";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface EmailVerificationProps {
  email: string;
  onVerificationSent: () => void;
  isLoading?: boolean;
}

const EmailVerification = ({
  email,
  onVerificationSent,
  isLoading = false,
}: EmailVerificationProps) => {
  const t = useTranslations("Auth.forgotPassword");

  return (
    <div className="flex sm:flex gap-5 flex-col">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h2 className="capitalize text-center font-extrabold text-secondary-foreground text-2xl">
          {t("emailSent")}
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs">
          {t("checkEmailInstructions")} <span className="font-semibold text-secondary-foreground">{email}</span>
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <button
          onClick={onVerificationSent}
          className="bg-primary text-primary-foreground p-3 rounded-full transition duration-400 hover:scale-105 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-4"
        >
          {isLoading ? t("sending") + "..." : "I've Verified My Email"}
          {!isLoading && <IoIosArrowRoundForward />}
        </button>

        <Link href="/auth">
          <button className="w-full bg-secondary text-secondary-foreground p-3 rounded-full transition duration-400 hover:scale-105 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-secondary hover:outline-offset-4">
            {t("backToLogin")}
            <IoIosArrowRoundForward />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EmailVerification;
