import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface IShop {
  id: number;
  title: string;
  desc: string;
  img: string;
  rating: number;
  workingHours: string;
}

interface AnimatedShopCardProps {
  shop: IShop;
  index: number;
}

export default function ShopCard({ shop, index }: AnimatedShopCardProps) {
  const [isExiting, setIsExiting] = useState(false);
  const exitVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
    exiting: { opacity: 0, y: 30, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="group relative w-full overflow-hidden rounded-3xl shadow-md min-h-60 transition-[height,transform] duration-300 ease-out hover:scale-[1.03] cursor-pointer"
      key={shop.id}
      variants={exitVariant}
      animate={isExiting ? "exiting" : "visible"}
      initial="hidden"
      transition={{
        duration: 0.7,
        delay: isExiting ? 0 : index * 0.1,
      }}
      viewport={{ once: false }}
      onViewportLeave={() => setIsExiting(true)}
      onViewportEnter={() => setIsExiting(false)}
    >
      <div className="absolute inset-0">
        <Image
          src={shop.img}
          alt={shop.title}
          width={800}
          height={800}
          className="w-full h-full object-cover transition-all duration-300 ease-out will-change-transform will-change-filter group-hover:scale-105 group-hover:blur-sm"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/60 transition-all duration-500 p-4 md:group-hover:p-5">
        <h3 className="text-white font-semibold text-lg line-clamp-1">
          {shop.title}
        </h3>

        <div className="opacity-100 translate-y-0 max-h-full md:opacity-0 md:translate-y-2 md:max-h-0 md:overflow-hidden md:transition-all md:duration-500 md:ease-out md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:max-h-20">
          <div className="flex items-center justify-between mt-2">
            <p className="text-white">{shop.workingHours}</p>
            <div className="flex items-center gap-2">
              <p className="text-white">{shop.rating}</p>
              <Star fill="gold" stroke="none" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
