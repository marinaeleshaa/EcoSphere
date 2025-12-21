"use client";
import { Store } from "lucide-react";
import { useState, useEffect } from "react";
import {
  MdCheckCircleOutline,
  MdPendingActions,
  MdVisibilityOff,
} from "react-icons/md";
import { RiNumbersLine } from "react-icons/ri";
import { useTranslations } from "next-intl";

const ShopHero = () => {
  const t = useTranslations("Admin.Shops");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [shops, setShops] = useState<any[]>([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch("/api/shops");
        if (response.ok) {
          const data = await response.json();
          setShops(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch shops for hero:", error);
      }
    };
    fetchShops();
  }, []);

  const stats = [
    {
      label: t("stats.total"),
      value: shops.length,
      icon: <RiNumbersLine className="w-5 h-5" />,
    },
    {
      label: t("stats.active"),
      value: shops.filter((s) => s.subscribed).length,
      icon: <MdCheckCircleOutline className="w-5 h-5" />,
    },
    {
      label: t("stats.pending"),
      value: shops.filter((s) => !s.subscribed).length,
      icon: <MdPendingActions className="w-5 h-5" />,
    },
    {
      label: t("stats.hidden"),
      value: shops.filter((s) => s.isHidden).length,
      icon: <MdVisibilityOff className="w-5 h-5" />,
    },
  ];

  return (
    <div className="bg-linear-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <Store className="w-8 h-8" />
          <h1 className="text-2xl sm:text-3xl font-bold">{t("title")}</h1>
        </div>

        <p className="text-primary-foreground/80 text-sm sm:text-base max-w-2xl mb-6 text-center">
          {t("description")}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-colors"
            >
              <div className="flex items-center gap-2 text-primary-foreground/70 text-xs sm:text-sm mb-2">
                {stat.icon}
                <span>{stat.label}</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopHero;
