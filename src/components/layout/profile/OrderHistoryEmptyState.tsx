"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const OrderHistoryEmptyState = () => {
  const t = useTranslations("Profile.customer.orderHistory");
  return (
    <div className="flex items-center justify-center p-20 bg-primary/10 rounded-xl mt-10 my-20">
      <div className="text-center max-w-md px-6">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 ">
          <ShoppingBag className="w-10 h-10 text-primary" />
        </div>

        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {t("noOrders")}
        </h2>

        <p className="text-secondary-foreground mb-6">
          {t("noOrdersDescription")}
        </p>

        <Link
          href="/store"
          className="bg-primary text-primary-foreground px-10 py-3 rounded-full transition duration-400 hover:scale-102 text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-4"
        >
          {t("browseOrders")}
        </Link>
      </div>
    </div>
  );
};

export default OrderHistoryEmptyState;
