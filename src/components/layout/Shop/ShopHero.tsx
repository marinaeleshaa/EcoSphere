import { motion } from "framer-motion";
import { useState } from "react";

export default function ShopHero() {
  const [active, setActive] = useState<number | null>(null);

  const cards = [
    {
      id: 1,
      emoji: "🌎",
      title: "Planet-Friendly Products",
      text: "Each shop prioritizes items that are inherently sustainable and kind to the environment, minimizing ecological impact.",
    },
    {
      id: 2,
      emoji: "♻️",
      title: "Eco-Conscious Sourcing",
      text: "They ensure full responsibility and ethical sourcing, favoring materials that are renewable, recycled, or low-waste.",
    },
    {
      id: 3,
      emoji: "🌱",
      title: "Commitment to You",
      text: "Products are carefully selected to be safe, kind to your health, and promote a holistic, sustainable lifestyle.",
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
      <div className="rounded-3xl p-6">
        <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
          Quality You Can Trust
        </h2>

        <p className="text-foreground leading-relaxed mb-6 text-center">
          We check every partner shop with real care keeping things healthy,
          planet-friendly, and a little fun along the way. Hover over a card to
          explore it!
        </p>

        {/* Row of cards */}
        <div className="flex gap-4 w-full flex-col items-center md:flex-row justify-center">
          {cards.map((card) => {
            const isActive = active === card.id;
            const isDimmed = active !== null && !isActive;

            return (
              <div
                key={card.id}
                onMouseEnter={() => setActive(card.id)}
                onMouseLeave={() => setActive(null)}
                className={`
          transition-all duration-300 ease-in-out cursor-pointer rounded-2xl border p-4 shadow-xl backdrop-blur-md group w-full md:w-1/3
          
          ${isDimmed ? "opacity-40 scale-[0.98]" : "opacity-100 scale-100"}
          
          bg-primary border-0 hover:-translate-y-1`}
              >
                <div className="text-3xl mb-2">{card.emoji}</div>
                <h3 className="font-semibold text-primary-foreground text-lg mb-1">
                  {card.title}
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
                  {card.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
