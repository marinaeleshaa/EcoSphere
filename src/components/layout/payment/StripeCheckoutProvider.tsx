"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
}

const stripePromise = loadStripe(publishableKey);

interface Props {
  clientSecret: string;
  children: ReactNode;
}

export function StripeCheckoutProvider({ clientSecret, children }: Props) {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
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
      {children}
    </Elements>
  );
}
