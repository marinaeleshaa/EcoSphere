"use client";

import { MotionItem } from "@/components/layout/PaymentVerification/MotionItem";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";

interface PaymentFailedClientProps {
  orderId?: string;
  errorCode?: string;
  errorMessage?: string;
}

export function PaymentFailedClient({
  orderId,
  errorCode,
  errorMessage,
}: PaymentFailedClientProps) {
  const t = useTranslations("Checkout.verification");
  const locale = useLocale();

  // Map Stripe error codes to user-friendly messages
  const getErrorMessage = (code?: string, message?: string): string => {
    if (message) return message;

    switch (code) {
      case "card_declined":
        return t("cardDeclined") || "Your card was declined.";
      case "insufficient_funds":
        return "Insufficient funds in your account.";
      case "expired_card":
        return "Your card has expired.";
      case "incorrect_cvc":
        return "Your card's security code is incorrect.";
      case "processing_error":
        return "An error occurred while processing your card.";
      default:
        return (
          t("failedDesc") || "Payment could not be processed. Please try again."
        );
    }
  };

  const displayError = getErrorMessage(errorCode, errorMessage);

  return (
    <MotionItem className="w-full bg-primary/10 rounded-2xl p-4 border border-accent-foreground/20 flex flex-col gap-3 text-left">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 min-w-5">
          <div className="w-1.5 h-1.5 rounded-full mt-2 bg-accent-foreground/80" />
        </div>
        <div className="flex-1">
          {errorCode && (
            <p className="text-l font-bold uppercase text-accent-foreground tracking-wider mb-1">
              {t("errorCode", { code: errorCode }) ||
                `Error Code: ${errorCode}`}
            </p>
          )}
          <p className="text-sm font-semibold text-accent-foreground/80">
            {displayError}
          </p>
          {orderId && (
            <p className="text-xs text-accent-foreground/60 mt-2 font-mono">
              Order ID: {orderId.slice(-8).toUpperCase()}
            </p>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-accent-foreground/20">
        <p className="text-xs text-accent-foreground/70">
          {t("failedHelpText") ||
            "If this problem persists, please contact support or try a different payment method."}
        </p>
      </div>

      {orderId && (
        <div className="pt-2">
          <Link
            href={`/${locale}/checkout`}
            className="text-xs text-primary hover:underline"
          >
            {t("tryAgainWithSameOrder") || "Try again with this order"}
          </Link>
        </div>
      )}
    </MotionItem>
  );
}
