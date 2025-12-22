"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IShop } from "@/types/ShopTypes";
import { getAverageRating } from "./ShopSection";

interface ShopCardProps {
  shop?: IShop;
  index: number;
  loading?: boolean;
}

export default function ShopCard({
  shop,
  index,
  loading,
}: Readonly<ShopCardProps>) {
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  if (loading || !shop) {
    return (
      <div className="w-full h-60 rounded-3xl bg-gray-200 animate-pulse" />
    );
  }

  const exitVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
    exiting: { opacity: 0, y: 30, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="group relative w-full overflow-hidden rounded-3xl shadow-md min-h-60 transition-[height,transform] duration-300 ease-out hover:scale-[1.03] cursor-pointer"
      key={shop._id}
      variants={exitVariant}
      animate={isExiting ? "exiting" : "visible"}
      initial="hidden"
      transition={{ duration: 0.7, delay: index * 0.1 }}
      viewport={{ once: false }}
      onViewportLeave={() => setIsExiting(true)}
      onViewportEnter={() => setIsExiting(false)}
      onClick={() => router.push(`/shop/${shop._id}`)}
    >
      <div className="absolute inset-0">
        <Image
          src={shop.avatar?.url ?? "/shop-img.jpg"}
          alt={shop.name}
          width={800}
          height={800}
          className="w-full h-full object-cover transition-all duration-300 ease-out will-change-transform will-change-filter group-hover:scale-105 group-hover:blur-[1.5px]"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 bg-primary/80 transition-all duration-500 p-4 md:group-hover:p-5">
        <div className="flex justify-between gap-4">
          <h3 className="text-primary-foreground font-semibold text-lg line-clamp-1">
            {shop.name}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-primary-foreground font-semibold">
              {getAverageRating(shop).toFixed(1)}
            </p>
            <Star
              fill={getAverageRating(shop) > 0 ? "gold" : "none"}
              stroke="gold"
            />
          </div>
        </div>

        <div className="opacity-100 translate-y-0 max-h-full md:opacity-0 md:translate-y-2 md:max-h-0 md:overflow-hidden md:transition-all md:duration-500 md:ease-out md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:max-h-20">
          <div className="flex flex-col items-start justify-between mt-2 text-sm">
            <p className="text-primary-foreground font-semibold">
              {shop.location}
            </p>
            <p className="text-primary-foreground font-semibold">
              {shop.workingHours}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
