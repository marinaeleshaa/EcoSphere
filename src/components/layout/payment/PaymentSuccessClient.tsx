"use client";

import { useEffect, useState } from "react";
import { getOrderById } from "@/frontend/api/Payment";
import { IOrder } from "@/backend/features/orders/order.model";
import { MotionItem } from "@/components/layout/PaymentVerification/MotionItem";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

interface PaymentSuccessClientProps {
  orderId: string;
  paymentIntentId?: string;
}

export function PaymentSuccessClient({
  orderId,
  paymentIntentId,
}: PaymentSuccessClientProps) {
  const t = useTranslations("Checkout.verification");
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(orderId);
        if (response?.data) {
          setOrder(response.data);
        } else {
          setError("Order not found");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <MotionItem className="w-full bg-primary/10 rounded-2xl p-5 border-4 border-accent-foreground/10 space-y-4 backdrop-blur-sm">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-accent-foreground" />
        </div>
      </MotionItem>
    );
  }

  if (error || !order) {
    return (
      <MotionItem className="w-full bg-primary/10 rounded-2xl p-5 border-4 border-accent-foreground/10 space-y-4 backdrop-blur-sm">
        <div className="text-center text-accent-foreground/80">
          <p>{error || "Order not found"}</p>
        </div>
      </MotionItem>
    );
  }

  // Format order ID for display (last 8 characters)
  const displayOrderId = `${order._id}`.slice(-8).toUpperCase();

  // Format payment intent ID for display (last 12 characters if available)
  const displayPaymentId = paymentIntentId
    ? paymentIntentId.slice(-12).toUpperCase()
    : displayOrderId;

  // Format amount - orderPrice is stored in base currency units (not cents)
  // No division needed, just format to 2 decimal places
  const formattedAmount = order.orderPrice.toFixed(2);

  return (
    <MotionItem className="w-full bg-primary/10 rounded-2xl p-5 border-4 border-accent-foreground/10 space-y-4 backdrop-blur-sm">
      <div className="flex justify-between items-center border-b-4 border-accent-foreground/30 pb-3">
        <span className="text-sm font-medium text-accent-foreground/80">
          {t("orderId") || "Order ID"}
        </span>
        <span className="font-mono text-sm font-bold text-accent-foreground">
          #{displayOrderId}
        </span>
      </div>

      {paymentIntentId && (
        <div className="flex justify-between items-center border-b-2 border-accent-foreground/20 pb-2">
          <span className="text-sm font-medium text-accent-foreground/80">
            {t("transactionId") || "Transaction ID"}
          </span>
          <span className="font-mono text-xs font-bold text-accent-foreground">
            {displayPaymentId}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center pt-2">
        <span className="text-sm font-medium text-accent-foreground/80">
          {t("totalAmount") || "Total Amount"}
        </span>
        <span className="text-2xl font-bold text-accent-foreground">
          {formattedAmount} EGP
        </span>
      </div>

      {order.status && (
        <div className="flex justify-between items-center pt-2 border-t-2 border-accent-foreground/20">
          <span className="text-sm font-medium text-accent-foreground/80">
            Status
          </span>
          <span className="text-sm font-bold text-accent-foreground capitalize">
            {order.status}
          </span>
        </div>
      )}

      {order.items && order.items.length > 0 && (
        <div className="pt-2 border-t-2 border-accent-foreground/20">
          <p className="text-sm font-medium text-accent-foreground/80 mb-2">
            Items ({order.items.length})
          </p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {order.items.map((item: any, index: number) => (
              <div
                key={index}
                className="flex justify-between text-xs text-accent-foreground/70"
              >
                <span>
                  {item.eventId ? "Event Ticket" : `Item ${index + 1}`}
                </span>
                <span>
                  Qty: {item.quantity} × {item.unitPrice.toFixed(2)} EGP
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </MotionItem>
  );
}
