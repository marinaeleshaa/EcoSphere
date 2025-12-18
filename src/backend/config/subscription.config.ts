/**
 * Subscription plan -> Stripe Price ID mapping.
 * Keep price ids in environment variables to avoid shipping raw prices in the frontend.
 * Example env names:
 *   STRIPE_PRICE_PRO_MONTHLY
 *   STRIPE_PRICE_PRO_YEARLY
 */
export const SUBSCRIPTION_PRICE_MAP: Record<string, string | undefined> = {
	starter_monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY,
	pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
	growth_monthly: process.env.STRIPE_PRICE_GROWTH_MONTHLY,
	pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY,
};

export function getPriceIdForPlan(planKey: string): string {
	const priceId = SUBSCRIPTION_PRICE_MAP[planKey];
	if (!priceId) throw new Error(`Unknown or unconfigured plan key: ${planKey}`);
	return priceId;
}
