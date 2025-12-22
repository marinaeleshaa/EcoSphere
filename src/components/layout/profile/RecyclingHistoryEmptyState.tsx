"use client";

import { useTranslations } from "next-intl";
import { Package } from "lucide-react";

const RecyclingHistoryEmptyState = () => {
  const t = useTranslations("Profile.customer.recyclingHistory");

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 p-4 bg-muted/20 rounded-full">
        <Package className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-card-foreground">
        {t("noRecyclingOrders")}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {t("noRecyclingOrdersDescription")}
      </p>
      <a
        href="/en/recycle"
        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        {t("browseRecycling")}
      </a>
    </div>
  );
};

export default RecyclingHistoryEmptyState;
