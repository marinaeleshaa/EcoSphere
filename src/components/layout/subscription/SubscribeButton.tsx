"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function SubscribeButton({
  planKey,
  label = "Subscribe",
  className = "",
  disabled = false,
}: Readonly<{
  planKey: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}>) {
  const [loading, setLoading] = useState(false);
  const { data: user } = useSession();

  async function handleClick() {
    try {
      setLoading(true);
      const res = await fetch("/api/subscriptions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planKey,
          customerEmail: user?.user.email,
          userId: user?.user.id,
          role: user?.user.role,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to create checkout session");

      // Redirect to Stripe Checkout
      if (data.url) {
        globalThis.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      alert((err as Error).message || "Subscription failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full myBtnPrimary ${className}`}
      disabled={loading || disabled}
    >
      {loading ? "Redirecting..." : label}
    </button>
  );
}
