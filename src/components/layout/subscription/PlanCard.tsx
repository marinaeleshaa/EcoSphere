import React from "react";
import { Check, Leaf } from "lucide-react";

export default function PlanCard({ plan }: { plan: ISubscribePlan }) {
  // const plan = {
  //   title: "Pro Ecosphere Plan",
  //   subtitle: "For professional stores and large event organizers.",
  //   price: "$59 / month",
  //   btnText: "Go Pro",
  //   features: [
  //     "Unlimited products or events",
  //     "Full control panel customization",
  //     "Deep AI-powered analytics",
  //     "24/7 dedicated support",
  //     "Access to all ecosphere premium tools",
  //   ],
  //   icon: "eco-pro",
  // };

  return (
    <div className="">
      <div className="bg-background rounded-2xl   shadow-xl max-w-sm w-full overflow-hidden transform transition-all hover:scale-105 duration-300 flex flex-col justify-between">
        {/* Header with gradient background */}
        <div className="bg-linear-to-r  from-primary to-primary/50 p-8 text-primary-foreground flex justify-between items-center ">
          <div className="text-balance">
            <h2 className="text-3xl font-bold mb-2">{plan.title}</h2>
            <p className=" text-sm">{plan.subtitle}</p>
          </div>
          <div className=" bg-secondary/20 rounded-full p-3 backdrop-blur-sm">
            <Leaf className="w-8 h-8" />
          </div>
        </div>

        {/* Price section */}
        <div className="px-8 py-6 bg-linear-to-b from-primary/20 to-background ">
          <div className="text-center">
            <span className="text-5xl font-bold text-foreground">
              {plan.price.split(" / ")[0]}
            </span>
            <span className="text-xl text-primary ml-2">
              / {plan.price.split(" / ")[1]}
            </span>
          </div>
        </div>

        {/* Features list */}
        <div className="px-8 py-6 flex-1">
          <ul className="space-y-4">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <div className="shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                </div>
                <span className="ml-3 text-foreground/50">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <div className="px-8 pb-8">
          <button className="w-full myBtnPrimary">
            {plan.btnText}
          </button>
        </div>
      </div>
    </div>
  );
}
