"use client";

import { useState } from "react";
import { CreditCard, Banknote } from "lucide-react";
import { useAppSelector } from "@/frontend/redux/hooks";
import { selectCartPrice } from "@/frontend/redux/selector/cartSelector";
import { CardCheckoutSection } from "@/components/layout/payment/CardCheckoutSection";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

type PaymentMethod = "card" | "cash";

export default function CheckoutPage() {
  const t = useTranslations("Checkout.page");
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const eventAmount = searchParams.get("amount");

  const cartTotal = useAppSelector(selectCartPrice);
  const total = eventId ? Number(eventAmount) : cartTotal;
  const amount = total * 100;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  if (!total && !eventId) return <p>{t("somethingWentWrong")}</p>;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg relative bg-white dark:bg-zinc-950 p-6 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 z-10">
        <h1 className="text-2xl font-bold text-center mb-6">{t("title")}</h1>

        {/* ⬇️ ORIGINAL UI — UNCHANGED */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setPaymentMethod("card")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
              paymentMethod === "card"
                ? "border-primary bg-primary/5 text-primary"
                : "border-zinc-200 dark:border-zinc-800 hover:border-primary/50 text-zinc-500"
            }`}
          >
            <CreditCard className="w-8 h-8 mb-2" />
            <span className="font-medium">{t("payWithCard")}</span>
          </button>

          <button
            onClick={() => setPaymentMethod("cash")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
              paymentMethod === "cash"
                ? "border-primary bg-primary/5 text-primary"
                : "border-zinc-200 dark:border-zinc-800 hover:border-primary/50 text-zinc-500"
            }`}
          >
            <Banknote className="w-8 h-8 mb-2" />
            <span className="font-medium">{t("payWithCash")}</span>
          </button>
        </div>

        {/* ⬇️ LOGIC-ONLY SWITCH */}
        {paymentMethod === "card" ? (
          <CardCheckoutSection amount={amount} eventId={eventId} />
        ) : (
          /* ⬇️ ORIGINAL CASH UI — UNCHANGED */
          <div className="text-center py-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Banknote className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t("payWithCash")}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 px-4">
              {t("youWillPay")}{" "}
              <strong className="text-primary">
                {(amount / 100).toFixed(2)} EGP
              </strong>{" "}
              {t("directlyToCourier")}
            </p>
            <button className="w-full myBtnPrimary">{t("confirmOrder")}</button>
          </div>
        )}
      </div>
    </div>
  );
}
