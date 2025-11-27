import { useRef, useEffect } from "react";
import ShopCard from "./ShopCard";

export default function ShopSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect (infinite-like)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let scrollPos = 0;

    const tick = () => {
      scrollPos += 0.6;
      track.scrollLeft = scrollPos;

      // Loop halfway to fake infinite
      if (scrollPos >= track.scrollWidth / 2) {
        scrollPos = 0;
      }

      requestAnimationFrame(tick);
    };

    tick();
  }, []);

  const cards = [
    {
      title: "PVC film for food wrap",
      img: "/store5.png",
      desc: "Safe for food, prevents evaporation, protects vegetables.Safe for food, prevents evaporation, protects vegetables.Safe for food, prevents evaporation, protects vegetables.",
    },
    {
      title: "PVC film for industrial use",
      img: "/store5.png",
      desc: "Durable & strong for industrial applications.",
    },
    {
      title: "Capacitor film (electric)",
      img: "/store5.png",
      desc: "High dielectric strength for electric capacitors.",
    },
    {
      title: "Capacitor film (electric)",
      img: "/store5.png",
      desc: "High dielectric strength for electric capacitors.",
    },
    {
      title: "Capacitor film",
      img: "/store5.png",
      desc: "High dielectric strength for electric capacitors.",
    },
    {
      title: "Capacitor film (electric)",
      img: "/store5.png",
      desc: "Safe for food, prevents evaporation, protects vegetables.Safe for food, prevents evaporation, protects vegetables.Safe for food, prevents evaporation, protects vegetables.",
    },
  ];

  return (
    <div className="w-full flex flex-wrap gap-8 mb-6 justify-center">
      {cards.map((card, index) => (
        <ShopCard key={index} shop={card} />
      ))}
    </div>
  );
}
