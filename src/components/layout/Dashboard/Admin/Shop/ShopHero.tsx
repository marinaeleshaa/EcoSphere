"use client";
import { Store } from "lucide-react";
import { useState } from "react";
import {
  MdCheckCircleOutline,
  MdPendingActions,
  MdVisibilityOff,
} from "react-icons/md";
import { RiNumbersLine } from "react-icons/ri";

const ShopHero = () => {
  const [shops] = useState([
    {
      id: 1,
      name: "Tech Haven",
      email: "contact@techhaven.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      hidden: false,
    },
    {
      id: 2,
      name: "Fashion Forward",
      email: "info@fashionforward.com",
      phone: "+1 (555) 234-5678",
      status: "pending",
      hidden: false,
    },
    {
      id: 3,
      name: "Home Essentials",
      email: "support@homeessentials.com",
      phone: "+1 (555) 345-6789",
      status: "active",
      hidden: true,
    },
    {
      id: 4,
      name: "Sports Zone",
      email: "hello@sportszone.com",
      phone: "+1 (555) 456-7890",
      status: "inactive",
      hidden: false,
    },
  ]);

  const stats = [
    {
      label: "Total Shops",
      value: shops.length,
      icon: <RiNumbersLine className="w-5 h-5" />,
    },
    {
      label: "Active",
      value: shops.filter((s) => s.status === "active").length,
      icon: <MdCheckCircleOutline className="w-5 h-5" />,
    },
    {
      label: "Pending",
      value: shops.filter((s) => s.status === "pending").length,
      icon: <MdPendingActions className="w-5 h-5" />,
    },
    {
      label: "Hidden",
      value: shops.filter((s) => s.hidden).length,
      icon: <MdVisibilityOff className="w-5 h-5" />,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <Store className="w-8 h-8" />
          <h1 className="text-2xl sm:text-3xl font-bold">Shop Requests Dashboard</h1>
        </div>
        
        <p className="text-primary-foreground/80 text-sm sm:text-base max-w-2xl mb-6 text-center">
          Manage and monitor all shop registration requests. Review, approve,
          and control shop visibility with ease.
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