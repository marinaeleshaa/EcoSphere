import { useEffect, useRef } from "react";
import Image from "next/image";

export default function ShopsSlider() {
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
    <div className="w-full flex flex-wrap gap-6 px-20">
      {cards.map((c, i) => (
        <div
          key={i}
          className="group relative bg-primary rounded-3xl shadow-lg cursor-pointer overflow-hidden w-full md:w-[calc(33.333%-16px)] md:hover:w-[550px] transition-all duration-500 ease-out flex flex-col md:flex-row"
        >
          {/* LEFT CONTENT */}
          <div className="relative z-20 p-6 flex-1 flex flex-col justify-center items-start md:group-hover:w-1/2 md:group-hover:flex-none">
            <h3 className="font-semibold text-primary-foreground text-lg mb-2">
              {c.title}
            </h3>
            <p className="text-sm text-primary-foreground md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 line-clamp-2">
              {c.desc}
            </p>
            <button className="mt-4 text-primary-foreground font-medium md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 underline">
              Read More →
            </button>
          </div>

          {/* IMAGE - Visible on mobile, hover-only on desktop */}
          <div className="relative w-full h-48 md:absolute md:inset-y-0 md:right-0 md:w-0 md:h-auto md:opacity-0 md:group-hover:w-1/2 md:group-hover:opacity-100 transition-all duration-500 ease-out z-10 overflow-hidden rounded-b-3xl md:rounded-b-none md:rounded-r-3xl">
            <Image
              width={500}
              height={500}
              alt={c.title}
              src={c.img}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
}