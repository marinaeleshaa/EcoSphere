"use client";
import { useAppDispatch, useAppSelector } from "@/frontend/redux/hooks";
import { useState } from "react";
import { Check } from "lucide-react";
import { selectCartTotal } from "@/frontend/redux/selector/cartSelector";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { updateCartTotal } from "@/frontend/redux/Slice/CartSlice";
import { useRouter } from "next/navigation";

export default function OrderSummary() {
  const t = useTranslations("Cart.orderSummary");
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [discountRate, setDiscountRate] = useState(0);

  const subtotalCents = useAppSelector(selectCartTotal);
  const dispatch = useAppDispatch();

  const discountCents = Math.round(subtotalCents! * discountRate);
  let deliveryCents = 0;

  if (subtotalCents) deliveryCents = 50;

  const total = subtotalCents - discountCents + deliveryCents;

  const handleApplyCoupon = () => {
    fetch(`/api/discount/${couponCode.trim()}`, { method: "GET" })
      .then((res) => {
        if (res.ok)
          res.json().then((data) => {
            toast.success(t("toasts.couponApplied"));
            setDiscountRate(data.rate ?? 0);
          });
        else toast.error(t("toasts.invalidCoupon"));
      })
      .catch((err) => console.error(err));
    setCouponCode("");
  };

  const handleCheckout = () => {
    dispatch(updateCartTotal({ cartTotal: total }));
    router.push("/checkout");
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
            disabled={!!discountRate}
          />
          <button
            onClick={handleApplyCoupon}
            disabled={!!discountRate || !couponCode.trim()}
            className="px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium bg-primary text-primary-foreground rounded-full transition duration-400 hover:scale-102 hover:outline-2 hover:outline-primary hover:outline-offset-4 flex justify-center items-center"
          >
            {t("apply")}
          </button>
        </div>
        {discountRate ? (
          <p className="text-sm text-primary mt-2">{t("couponApplied")}</p>
        ) : (
          <p className="text-sm text-muted-foreground mt-2 capitalize">
            {t("no-coupon")}
          </p>
        )}
      </div>
      <div className="space-y-3 mb-6">
        {!!subtotalCents && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("subTotal")}</span>
            <span className="font-medium">
              {subtotalCents.toFixed(2)} {t("currency")}
            </span>
          </div>
        )}
        {!!discountRate && (
          <div className="flex justify-between text-sm">
            <span className="text-primary">
              {t("discount", { percent: discountRate * 100 })}
            </span>
            <span className="font-medium text-primary">
              -{discountCents.toFixed(2)} {t("currency")}
            </span>
          </div>
        )}
        {!!deliveryCents && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("deliveryFee")}</span>
            <span className="font-medium text-foreground">
              {deliveryCents.toFixed(2)} {t("currency")}
            </span>
          </div>
        )}
      </div>
      <div className="flex justify-between font-bold text-lg mb-6 pt-4 border-t border-primary">
        <span>{t("total")}</span>
        <span>
          {total.toFixed(2)} {t("currency")}
        </span>
      </div>

      <div className="flex items-start gap-2 mb-6 p-3 bg-muted/50 rounded-full">
        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm">
          <span>{t("warranty")}</span>
          <button className="text-primary hover:underline font-medium">
            {t("details")}
          </button>
        </div>
      </div>
      <button
        onClick={handleCheckout}
        className="myBtnPrimary w-full py-3 hover:opacity-90 font-semibold bg-primary text-primary-foreground p-3 rounded-full transition duration-400 hover:scale-102 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-4"
      >
        {t("checkoutNow")}
      </button>
    </div>
  );
}
