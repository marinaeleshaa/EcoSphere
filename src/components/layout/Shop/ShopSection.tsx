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

  const shops = [
    {
      id: 1,
      title: "PVC film for food wrap",
      img: "/store5.png",
      desc: "Safe for food, prevents evaporation, protects vegetables.Safe for food, prevents evaporation, protects vegetables.Safe for food, prevents evaporation, protects vegetables.",
    },
    {
      id: 2,
      title: "PVC film for industrial use",
      img: "/store5.png",
      desc: "Durable & strong for industrial applications.",
    },
    {
      id: 3,
      title: "Capacitor film (electric)",
      img: "/store5.png",
      desc: "High dielectric strength for electric capacitors.",
    },
    {
      id: 4,
      title: "Capacitor film (electric)",
      img: "/store5.png",
      desc: "High dielectric strength for electric capacitors.",
    },
    {
      id: 5,
      title: "Capacitor film",
      img: "/store5.png",
      desc: "High dielectric strength for electric capacitors.",
    },
    {
      id: 6,
      title: "Capacitor film (electric)",
      img: "/store5.png",
      desc: "Safe for food, prevents evaporation, protects vegetables.Safe for food, prevents evaporation, protects vegetables.Safe for food, prevents evaporation, protects vegetables.",
    },
    {
      id: 7,
      title: "Capacitor film (electric)",
      img: "/store5.png",
      desc: "Safe for food, prevents evaporation, protects vegetables.Safe for food, prevents evaporation, protects vegetables.Safe for food, prevents evaporation, protects vegetables.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-16 mb-4">
      {shops.map((shop) => (
        <ShopCard key={shop.id} shop={shop} />
      ))}
    </div>
  );
}
