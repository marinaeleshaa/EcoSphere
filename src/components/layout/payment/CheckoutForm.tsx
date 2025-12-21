import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

interface CheckoutFormProps {
  amount: number;
  onSuccess?: () => void;
  orderId: string | null;
}

export const CheckoutForm = ({
  amount,
  onSuccess,
  orderId,
}: CheckoutFormProps) => {
  const tForm = useTranslations("Checkout.form");
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const locale = useLocale();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsSuccess] = useState(false);
  const [, setPaymentIntentId] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Build success and cancel URLs with order data
      const baseUrl = globalThis.location.origin;
      const successParams = new URLSearchParams();
      if (orderId) successParams.set("orderId", orderId);

      const cancelParams = new URLSearchParams();
      if (orderId) cancelParams.set("orderId", orderId);

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${baseUrl}/${locale}/payment/success?${successParams}`,
        },
        redirect: "if_required",
      });

      if (error) {
        // Redirect to failed page with error info
        const failedParams = new URLSearchParams();
        if (orderId) failedParams.set("orderId", orderId);
        if (error.code) failedParams.set("errorCode", error.code);
        if (error.message) failedParams.set("errorMessage", error.message);
        router.push(`/${locale}/payment/failed?${failedParams.toString()}`);
        return;
      } else if (paymentIntent?.status === "succeeded") {
        setPaymentIntentId(paymentIntent.id);
        setIsSuccess(true);
        if (onSuccess) onSuccess();
        // Redirect to success page with order data
        const successParams = new URLSearchParams();
        if (orderId) successParams.set("orderId", orderId);
        if (paymentIntent.id)
          successParams.set("paymentIntentId", paymentIntent.id);
        router.push(`/${locale}/payment/success?${successParams.toString()}`);
      }
    } catch (e) {
      console.error(e);
      setErrorMessage(tForm("unexpectedError"));
      // Redirect to failed page on unexpected error
      const failedParams = new URLSearchParams();
      if (orderId) failedParams.set("orderId", orderId);
      router.push(`/${locale}/payment/failed?${failedParams.toString()}`);
    }

    setIsLoading(false);
  };

  // Removed inline success view - will redirect to success page instead

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto p-8 bg-white dark:bg-zinc-950 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800"
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/50 ">
          {tForm("securePayment")}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          {tForm("securePaymentDesc")}
        </p>
      </div>

      <div className="mb-6">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm flex items-start">
          <span className="mr-2">⚠️</span>
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full myBtnPrimary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {tForm("processing")}
          </>
        ) : (
          tForm("pay", { amount: (amount / 100).toFixed(2) })
        )}
      </button>

      <div className="mt-6 flex justify-center items-center gap-2 text-xs text-zinc-400 dark:text-zinc-600">
        <Lock className="w-3 h-3" />
        <span>{tForm("securedByStripe")}</span>
      </div>
    </form>
  );
};
