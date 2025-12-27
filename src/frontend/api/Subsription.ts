import { ISubscribePlanData } from "@/types/SubscribePlan";

export async function PostPlan(plan: ISubscribePlanData) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/payment-intent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(plan),
    }
  );

  if (!res.ok) {
    throw new Error("error in fetch api response");
  }
  return res;
}
