"use client";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Store } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { useTranslations } from "next-intl";

const ShopTable = () => {
  const t = useTranslations("Admin.Shops.table");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [shops, setShops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch shops
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch("/api/shops");
        if (response.ok) {
          const data = await response.json();
          // Map backend data to frontend structure if needed
          // Backend: IRestaurant { isHidden, ... }
          // Frontend state expects: { id (display purposes?), ... }
          // We can just use the backend data directly, but need to map _id to key
          setShops(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch shops:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShops();
  }, []);

  const toggleVisibility = async (id: string, currentHidden: boolean) => {
    try {
      // Optimistic update
      setShops((prev) =>
        prev.map((shop) =>
          shop._id === id ? { ...shop, isHidden: !shop.isHidden } : shop
        )
      );

      const response = await fetch(`/api/shops/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isHidden: !currentHidden }),
      });

      if (!response.ok) {
        // Revert on failure
        setShops((prev) =>
          prev.map((shop) =>
            shop._id === id ? { ...shop, isHidden: currentHidden } : shop
          )
        );
        console.error("Failed to update visibility");
      }
    } catch (error) {
      // Revert on error
      setShops((prev) =>
        prev.map((shop) =>
          shop._id === id ? { ...shop, isHidden: currentHidden } : shop
        )
      );
      console.error("Error updating visibility:", error);
    }
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

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

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
                    {t("headers.name")}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold  uppercase tracking-wider">
                    {t("headers.email")}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold  uppercase tracking-wider">
                    {t("headers.phone")}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold  uppercase tracking-wider">
                    {t("headers.status")}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold  uppercase tracking-wider">
                    {t("headers.visibility")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary">
                {shops.map((shop) => (
                  <tr
                    key={shop._id}
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
                      {shop.phoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          shop.subscribed ? "active" : "pending"
                        )}`}
                      >
                        {t(`status.${shop.subscribed ? "active" : "pending"}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          toggleVisibility(shop._id, shop.isHidden)
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer hover:scale-105 transition-all mx-auto ${
                          shop.isHidden
                            ? "bg-primary/20 text-foreground hover:bg-primary/30"
                            : "bg-primary text-primary-foreground hover:bg-primary/80"
                        }`}
                      >
                        {shop.isHidden ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            {t("actions.hidden")}
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            {t("actions.visible")}
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
