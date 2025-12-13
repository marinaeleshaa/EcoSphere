import { useEffect, useState } from "react";
import { createPaymentIntent } from "@/frontend/api/Payment";

interface UsePaymentIntentResult {
  clientSecret: string | null;
  loading: boolean;
  error: string | null;
}

export function usePaymentIntent(
  amount: number,
  enabled: boolean,
): UsePaymentIntentResult {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || amount <= 0) return;

    let isMounted = true;

    const init = async () => {
      setLoading(true);
      setError(null);

      try {
        const { clientSecret } = await createPaymentIntent(amount, "egp");
        if (isMounted) setClientSecret(clientSecret);
      } catch (err: any) {
        if (isMounted) {
          setError(
            err?.message ??
              "Failed to initialize payment. Please try again later.",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [amount, enabled]);

  return { clientSecret, loading, error };
}
