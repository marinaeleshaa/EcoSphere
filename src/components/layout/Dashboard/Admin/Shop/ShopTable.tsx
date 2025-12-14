"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Store } from "lucide-react";
import Pagination from "@/components/ui/Pagination";

const ShopTable = () => {
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

  const toggleVisibility = (id: number) => {
    setShops(
      shops.map((shop) =>
        shop.id === id ? { ...shop, hidden: !shop.hidden } : shop
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      {/* Table Section */}
      <div className="max-w-7xl mx-auto px-6 py-12  bg-secondary rounded-xl p-4 sm:p-6 lg:p-8">
        <div className="bg-secondary rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary  border-b border-background text-primary-foreground">
                  <th className="px-6 py-4 text-center text-xs font-semibold  uppercase tracking-wider">
                    Shop Name
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold  uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold  uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold  uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold  uppercase tracking-wider">
                    Visibility
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary">
                {shops.map((shop) => (
                  <tr
                    key={shop.id}
                    className="hover:bg-primary/10 transition-colors text-center"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <Store className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-medium text-foreground">
                          {shop.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-foreground/60">
                      {shop.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-foreground/60">
                      {shop.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          shop.status
                        )}`}
                      >
                        {shop.status.charAt(0).toUpperCase() +
                          shop.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleVisibility(shop.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer hover:scale-105 transition-all mx-auto ${
                          shop.hidden
                            ? "bg-primary/20 text-foreground hover:bg-primary/30"
                            : "bg-primary text-primary-foreground hover:bg-primary/80"
                        }`}
                      >
                        {shop.hidden ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Hidden
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            Visible
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination />
      </div>
    </div>
  );
};

export default ShopTable;
