"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslations } from 'next-intl';

export default function ShopHero() {
  const t = useTranslations('Shop.quality');
  const [active, setActive] = useState<number | null>(null);

  const cards = [
    {
      id: 1,
      emoji: "🌎",
      titleKey: "planetFriendly",
    },
    {
      id: 2,
      emoji: "♻️",
      titleKey: "ecoConscious",
    },
    {
      id: 3,
      emoji: "🌱",
      titleKey: "commitment",
    },
  ];

  return (
    <motion.div
      className="container mx-auto w-[80%] text-center"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <div className="rounded-3xl p-2">
        <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
          {t("title")}
        </h2>

        <p className="text-foreground leading-relaxed mb-6 text-center">
          {t("description")}
        </p>

        {/* Row of cards */}
        <div className="flex gap-6 w-full flex-col items-stretch md:flex-row justify-center">
          {cards.map((card) => {
            const isActive = active === card.id;
            const isDimmed = active !== null && !isActive;

            return (
              <div
                key={card.id}
                onMouseEnter={() => setActive(card.id)}
                onMouseLeave={() => setActive(null)}
                className={`transition-all duration-300 ease-in-out cursor-pointer rounded-2xl border p-4 shadow-xl backdrop-blur-md group w-full md:w-1/3
          
          ${isDimmed ? "opacity-70 scale-[0.98]" : "opacity-100 scale-100"}
          
          bg-primary border-0 hover:-translate-y-1`}
              >
                <div className="text-3xl mb-2">{card.emoji}</div>
                <h3 className="font-semibold text-primary-foreground text-lg mb-1">
                  {t(`cards.${card.titleKey}.title`)}
                </h3>
                <p
                  className={`text-sm mt-2 transition-all duration-300
            ${
              isActive
                ? "text-primary-foreground text-base"
                : "text-primary-foreground text-sm"
            }
          `}
                >
                  {t(`cards.${card.titleKey}.text`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
