"use client";
import { Store } from "lucide-react";
import  { useState } from "react";
const ShopHero = () => {
  const [shops, setShops] = useState([
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
  return (
    <div className="bg-linear-to-br from-primary via-primary/90 via-primary/70 to-primary/50 text-primary-foreground py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <Store className="w-12 h-12" />
          <h1 className="text-4xl font-bold">Shop Requests Dashboard</h1>
        </div>
        <p className="text-primary-foreground/80 text-lg max-w-2xl">
          Manage and monitor all shop registration requests. Review, approve,
          and control shop visibility with ease.
        </p>
        <div className="mt-8 flex gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
            <p className="text-primary-foreground/70 text-sm">Total Shops</p>
            <p className="text-3xl font-bold mt-1">{shops.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
            <p className="text-primary-foreground/70 text-sm">Active</p>
            <p className="text-3xl font-bold mt-1">
              {shops.filter((s) => s.status === "active").length}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
            <p className="text-primary-foreground/70 text-sm">Hidden</p>
            <p className="text-3xl font-bold mt-1">
              {shops.filter((s) => s.hidden).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHero;
