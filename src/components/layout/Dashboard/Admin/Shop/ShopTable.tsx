"use client";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Store } from "lucide-react";
import { IShop } from "@/types/ShopTypes";
import { useTranslations } from "next-intl";

const ShopTable = () => {
  const t = useTranslations("Admin.Shops");
  const [shops, setShops] = useState<IShop[]>([]);
  const [status, setStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch shops
  useEffect(() => {
    const fetchShops = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/shops?status=${status}`);
        if (response.ok) {
          const data = await response.json();
          setShops(data.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch shops:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShops();
  }, [status]);

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

  return (
    <div className="bg-secondary rounded-xl p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["all", "visible", "hidden"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                status === s
                  ? "bg-primary text-white shadow-md scale-105"
                  : "bg-white dark:bg-white/10 text-muted-foreground hover:bg-gray-50 dark:hover:bg-white/20"
              }`}
            >
              {t(`filter.${s}`)}
            </button>
          ))}
        </div>

        <div className="bg-secondary rounded-xl shadow-lg border border-primary/10 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-foreground/60">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <p>{t("Loading") || "Loading Shops..."}</p>
            </div>
          ) : shops.length === 0 ? (
            <div className="p-12 text-center text-foreground/60">
              <Store className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="italic">
                {t("filter.noShopsFound") ||
                  "No shops found matching this filter."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-primary-foreground border-b border-background">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      {t("table.headers.name")}
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                      {t("table.headers.email")}
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                      {t("table.headers.phone")}
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                      {t("table.headers.status")}
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                      {t("table.headers.visibility")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10">
                  {shops.map((shop) => (
                    <tr
                      key={shop._id}
                      className="hover:bg-primary/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Store className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">
                            {shop.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-foreground/60">
                        {shop.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-foreground/60">
                        {shop.phoneNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            shop.subscribed ? "active" : "pending"
                          )}`}
                        >
                          {t(
                            `table.status.${
                              shop.subscribed ? "active" : "pending"
                            }`
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() =>
                            toggleVisibility(shop._id, !!shop.isHidden)
                          }
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer hover:scale-105 transition-all mx-auto ${
                            shop.isHidden
                              ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
                              : "bg-primary-50 text-primary hover:bg-primary-100 dark:bg-primary/20 dark:text-foreground-primary"
                          }`}
                        >
                          {shop.isHidden ? (
                            <>
                              <EyeOff className="w-4 h-4" />
                              {t("table.actions.hidden")}
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              {t("table.actions.visible")}
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopTable;
