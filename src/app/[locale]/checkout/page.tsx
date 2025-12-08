"use client";

import { useTheme } from "next-themes";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { CheckoutForm } from "@/components/payment/CheckoutForm";
import { createPaymentIntent } from "@/frontend/api/Payment";
import { Loader2, CreditCard, Banknote } from "lucide-react";
import { useAppSelector } from "@/frontend/redux/hooks";
import { selectCartTotal } from "@/frontend/redux/selector/cartSelector";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_sample"
);

type PaymentMethod = "card" | "cash";

export default function CheckoutPage() {
  const subtotalCents = useAppSelector(selectCartTotal);
  const discountCents = Math.round(subtotalCents * 0.1);
  const deliveryCents = 5000; // 50 EGP (Stripe requires minimum charge of ~$0.50)

  const amount = subtotalCents - discountCents + deliveryCents;

  const { theme, systemTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingSecret, setLoadingSecret] = useState(false);

  useEffect(() => {
    if (paymentMethod === "card" && !clientSecret && !loadingSecret && !error) {
      const initPayment = async () => {
        setLoadingSecret(true);
        try {
          const { clientSecret } = await createPaymentIntent(amount, "egp");
          setClientSecret(clientSecret);
        } catch (err: any) {
          console.error("Failed to init payment:", err);
          setError(
            err.message ||
              "Failed to initialize payment session. Is the backend running?"
          );
        } finally {
          setLoadingSecret(false);
        }
      };
      initPayment();
    }
  }, [amount, paymentMethod, clientSecret, loadingSecret, error]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-100 dark:border-red-900 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Error Loading Checkout
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg relative bg-white dark:bg-zinc-950 p-6 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 z-10">
        <h1 className="text-2xl font-bold text-center mb-6">Checkout</h1>

        {/* Payment Method Selector */}
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
            <span className="font-medium">Pay with Card</span>
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
            <span className="font-medium">Cash on Delivery</span>
          </button>
        </div>

        {/* Content Area */}
        {paymentMethod === "card" ? (
          <>
            {!clientSecret || loadingSecret ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-zinc-500 animate-pulse">
                  Initializing Secure Payment...
                </p>
              </div>
            ) : (
              clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: isDark ? "night" : "stripe",
                      variables: {
                        colorPrimary: "#0da64f",
                        colorText: isDark ? "#ffffff" : "#0f0f0f",
                        borderRadius: "0.75rem",
                      },
                    },
                  }}
                >
                  <CheckoutForm amount={amount} />
                </Elements>
              )
            )}
          </>
        ) : (
          <div className="text-center py-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Banknote className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">Cash on Delivery</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 px-4">
              You will pay <strong>{(amount / 100).toFixed(2)}EGP</strong>{" "}
              directly to the courier upon delivery.
            </p>
            <button
              className="w-full myBtnPrimary"
              onClick={() => alert("Order Placed Successfully! (Simulation)")}
            >
              Confirm Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
