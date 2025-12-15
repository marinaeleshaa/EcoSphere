import { useEffect, useState } from "react";
import { createOrder, createPaymentIntent } from "@/frontend/api/Payment";
import { useAppDispatch, useAppSelector } from "@/frontend/redux/hooks";
import { selectCartItemsArray } from "@/frontend/redux/selector/cartSelector";
import { mapCartBackendData } from "@/frontend/redux/middleware/cartSyncMiddleware";
import { clearCart } from "@/frontend/redux/Slice/CartSlice";

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
  const cartItems = mapCartBackendData(useAppSelector(selectCartItemsArray));
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!enabled || amount <= 0) return;

    let isMounted = true;

    const init = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await createOrder(cartItems);
        dispatch(clearCart());
        const { clientSecret } = await createPaymentIntent(
          amount,
          {
            orderId: `${response!.data!._id}`,
            userId: `${response!.data!.userId}`, // leave it like this for safety
          },
          "EGP",
        );
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
