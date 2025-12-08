"use client";
import { useAppSelector } from "@/frontend/redux/hooks";
import { useState } from "react";
import { Check } from "lucide-react";
import { selectCartTotal } from "@/frontend/redux/selector/cartSelector";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function OrderSummary() {
  const t = useTranslations("Cart.orderSummary");
  const subtotalCents = useAppSelector(selectCartTotal);
  const discountCents = Math.round(subtotalCents * 0.1);
  const deliveryCents = 5000;

  const rawTotal = subtotalCents - discountCents + deliveryCents;
  const total = rawTotal;
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(false);

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(true);
    }
  };

  return (
    <div className="rounded-2xl p-6 shadow-md  border border-primary">
      <h2 className="text-xl font-semibold mb-6 text-center">{t("title")}</h2>
      <div className="mb-6">
        <div className="flex flex-col :flex-row gap-3">
          <input
            type="text"
            placeholder={t("promoCode")}
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1   bg-input text-input-foreground rounded-full myInput"
            disabled={appliedCoupon}
          />
          <button
            onClick={handleApplyCoupon}
            disabled={appliedCoupon || !couponCode.trim()}
            className="px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium bg-primary text-primary-foreground rounded-full transition duration-400 hover:scale-102 hover:outline-2 hover:outline-primary hover:outline-offset-4 flex justify-center items-center"
          >
            {t("apply")}
          </button>
        </div>
        {appliedCoupon && (
          <p className="text-sm text-green-600 mt-2">{t("couponApplied")}</p>
        )}
      </div>
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("subTotal")}</span>
          <span className="font-medium ">
            {(subtotalCents / 100).toFixed(2)} EGP
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {t("discount", { percent: 10 })}
          </span>
          <span className="font-medium text-primary">
            -{(discountCents / 100).toFixed(2)} EGP
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("deliveryFee")}</span>
          <span className="font-medium text-foreground">
            {(deliveryCents / 100).toFixed(2)} EGP
          </span>
        </div>
      </div>
      <div className="flex justify-between font-bold text-lg mb-6 pt-4 border-t border-primary">
        <span>{t("total")}</span>
        <span>{(total / 100).toFixed(2)} EGP</span>
      </div>

      <div className="flex items-start gap-2 mb-6 p-3 bg-muted/50 rounded-full">
        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm">
          <span>{t("warranty")} </span>
          <button className="text-primary hover:underline font-medium">
            {t("details")}
          </button>
        </div>
      </div>
      <Link
        href="/checkout"
        className="w-full py-3 hover:opacity-90 font-semibold bg-primary text-primary-foreground p-3 rounded-full transition duration-400 hover:scale-102 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-4"
      >
        {t("checkoutNow")}
      </Link>
    </div>
  );
}
