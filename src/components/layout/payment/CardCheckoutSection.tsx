"use client";

import { Loader2 } from "lucide-react";
import { CheckoutForm } from "@/components/layout/payment/CheckoutForm";
import { StripeCheckoutProvider } from "./StripeCheckoutProvider";
import { usePaymentIntent } from "@/hooks/usePaymentIntent";

interface Props {
  amount: number;
}

export function CardCheckoutSection({ amount }: Props) {
  const { clientSecret, loading, error } = usePaymentIntent(amount, true);

  if (loading || !clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-zinc-500 animate-pulse">
          Initializing Secure Payment...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <StripeCheckoutProvider clientSecret={clientSecret}>
      <CheckoutForm amount={amount} />
    </StripeCheckoutProvider>
  );
}
