export const createPaymentIntent = async (
  amount: number,
  currency: string = "usd"
): Promise<{ clientSecret: string }> => {
  const response = await fetch("/api/stripe/payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create payment intent");
  }

  return response.json();
};
