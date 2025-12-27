"use client";

import { useAppDispatch, useAppSelector } from "@/frontend/redux/hooks";
import { useState } from "react";
import { FieldChoiceCard, PaymentMethod } from "@/components/ui/ChoiceCard";
import {
  selectCartItems,
  selectCartTotal,
} from "@/frontend/redux/selector/cartSelector";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { clearCart } from "@/frontend/redux/Slice/CartSlice";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createOrder } from "@/frontend/api/Payment";
import { IProductCart } from "@/types/ProductType";
import { OrderRequestItem } from "@/backend/features/orders/order.types";

const mapCartItemsToIOrderItems = (items: IProductCart[]): OrderRequestItem[] =>
  items.map((item) => ({
    restaurantId: item.restaurantId,
    productId: item.id,
    quantity: item.quantity,
  }));

export default function OrderSummary() {
  const t = useTranslations("Cart.orderSummary");
  const router = useRouter();
  const { data: session } = useSession();
  const [couponCode, setCouponCode] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Credit card");

  const subtotalCents = useAppSelector(selectCartTotal);
  const cartItems = useAppSelector(selectCartItems);
  const dispatch = useAppDispatch();

  const discountCents = Math.round(subtotalCents! * (discountRate / 100));

  let total = subtotalCents - discountCents;
  if (paymentMethod === "Cash on delivery") total += 30;

  const handleApplyCoupon = () => {
    fetch(`/api/discount/${couponCode.trim()}`, { method: "POST" })
      .then((res) => {
        if (res.ok)
          res.json().then(({ data }) => {
            toast.success(t("toasts.couponApplied"));
            setDiscountRate(data.rate ?? 0);
          });
        else toast.error(t("toasts.invalidCoupon"));
      })
      .catch((err) => console.error(err));
    setCouponCode("");
  };

  const handleCheckout = () => {
    if (!session?.user) {
      toast.error(t("toasts.notCustomer"));
      router.push("/auth?reason=unauthorized");
      return;
    } else if (paymentMethod === "Credit card") stripePayment();
    else if (paymentMethod === "Cash on delivery") cashOnDelivery();
  };

  const cashOnDelivery = () =>
    createOrder(
      mapCartItemsToIOrderItems(Object.values(cartItems)),
      "cashOnDelivery",
      "preparing"
    )
      .then(() => {
        router.push("/profile");
        dispatch(clearCart());
      })
      .catch((err) => console.error(err));

  const stripePayment = () =>
    fetch("/api/payment/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session?.user.id,
        email: session?.user.email,
        cartItems: Object.values(cartItems),
      }),
    })
      .then((res) => {
        if (res.ok)
          res.json().then((session) => {
            dispatch(clearCart());
            window.location.href = session.url;
          });
      })
      .catch((error) => {
        console.error(error);
        toast.error(t("toasts.paymentFailed"));
      });

  return (
    <div className="rounded-2xl p-6 shadow-md border border-primary">
      <h2 className="text-xl font-semibold mb-6 text-center">{t("title")}</h2>
      <div className="mb-6">
        <div className="flex flex-col gap-3">
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
              {t("discount", { percent: discountRate })}
            </span>
            <span className="font-medium text-primary">
              -{discountCents.toFixed(2)} {t("currency")}
            </span>
          </div>
        )}
      </div>
      <div className="border-t text-primary" />
      {total > 0 && (
        <div className="mb-6">
          <FieldChoiceCard setPaymentMethod={setPaymentMethod} />
        </div>
      )}
      <div className="flex justify-between font-bold text-lg mb-2 pt-4 border-t border-primary">
        <span>{t("total")}</span>
        <span>
          {total.toFixed(2)} {t("currency")}
        </span>
      </div>
      {total < 30 && total > 0 && (
        <div className="flex text-center justify-center mb-3 text-destructive">
          30 is the minimum charge
        </div>
      )}
      <button
        onClick={handleCheckout}
        disabled={total < 30}
        aria-label={"30 is the minimum charge"}
        className={`myBtnPrimary w-full font-semibold transition duration-400 hover:scale-102 text-lg ${
          total < 30 ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        {t("checkoutNow")}
      </button>
    </div>
  );
}
