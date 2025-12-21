import { getTranslations } from "next-intl/server";
import PlanCard from "./PlanCard";
import { ISubscribePlan } from "@/types/SubscribePlan";

const SubscriptionSection = async ({ locale }: { locale: string }) => {
  const t = await getTranslations();
  const plans = t.raw("subscribe.plans") as ISubscribePlan[];

  return (
    <div className="w-[80%] mx-auto mb-10">
      <div className="w-full grid  grid-cols-1 md:grid-cols-3 gap-8 p-5">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`${index === 1 ? "md:-translate-y-[10%]" : ""}`}
          >
            <div className={`${index !== 0 ? "opacity-35" : ""}`}>
              <PlanCard plan={plan} locale={locale} index={index} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionSection;
