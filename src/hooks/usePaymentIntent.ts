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
  onPaymentSuccess?: () => void;
  orderId: string | null;
}

export function usePaymentIntent(
  amount: number,
  enabled: boolean,
  eventId?: string | null
): UsePaymentIntentResult {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const cartItems = mapCartBackendData(useAppSelector(selectCartItemsArray));
  const dispatch = useAppDispatch();

  // Callback to clear cart after successful payment
  const onPaymentSuccess = () => {
    dispatch(clearCart());
  };

  useEffect(() => {
    if (!enabled || amount <= 0) return;

    let isMounted = true;

    const init = async () => {
      setLoading(true);
      setError(null);

      try {
        const orderItems = eventId
          ? [{ eventId, quantity: 1, restaurantId: "" }]
          : cartItems;

        const response = await createOrder(orderItems as any);

        // Error handling: Stop flow if order creation fails
        if (!response?.data?._id) {
          throw new Error("Failed to create order. Please try again.");
        }

        // Don't clear cart here - wait for payment confirmation
        // Cart will be cleared in onSuccess callback after payment succeeds
        const userId = response.data.userId;
        // Convert userId to string safely (handles ObjectId or string from backend)
        let userIdString: string;
        if (typeof userId === "string") {
          userIdString = userId;
        } else if (userId && "toString" in userId) {
          userIdString = (userId as { toString(): string }).toString();
        } else {
          userIdString = "";
        }

        const currentOrderId = String(response.data._id);
        const { clientSecret } = await createPaymentIntent(
          amount,
          {
            orderId: currentOrderId,
            userId: userIdString,
          },
          "EGP"
        );
        if (isMounted) {
          setClientSecret(clientSecret);
          setOrderId(currentOrderId);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Failed to initialize payment. Please try again later.";
          setError(errorMessage);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
    };
    // cartItems is intentionally excluded - we only want to re-run when amount/enabled changes
    // cartItems are captured at the time of order creation, not on every cart change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, enabled]);

  return { clientSecret, loading, error, onPaymentSuccess, orderId };
}
