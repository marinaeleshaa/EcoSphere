import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  // Warn but don't crash dev if it's not set immediately, or throw if strict.
  // Given user hasn't set it, maybe throw for clarity when they try to use it.
  console.warn("STRIPE_SECRET_KEY is missing");
}

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder",
  {
    apiVersion: "2025-11-17.clover", // Update this to match your Stripe dashboard version
    typescript: true,
  }
);
