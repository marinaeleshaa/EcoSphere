"use client";
import React from "react";
import { ProductResponse } from "@/backend/features/product/dto/product.dto";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";

import { useTranslations } from "next-intl";

interface ProductCardProps {
  product: ProductResponse;
  onEdit: (product: ProductResponse) => void;
  onDelete: (productId: string) => void;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const t = useTranslations("Restaurant.Products");

  return (
    <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full bg-muted">
        {product.avatar?.url ? (
          <Image
            src={product.avatar.url}
            alt={product.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {t("noImage")}
          </div>
        )}
        {!product.availableOnline && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {t("unavailable")}
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3
            className="font-semibold text-lg line-clamp-1"
            title={product.title}
          >
            {product.title}
          </h3>
          <span className="font-bold text-primary">
            {t("currency")} {product.price.toFixed(2)}
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {product.subtitle}
        </p>

        <div className="flex gap-3 mt-4 pt-4 border-t border-border">
          <Button
            className="flex-1 myBtnPrimary text-sm h-10 w-full hover:scale-100"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(product);
            }}
          >
            <Edit className="h-4 w-4" />
            {t("actions.edit")}
          </Button>
          <Button
            variant="destructive"
            className="flex-1 rounded-full h-10 hover:scale-105 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(String(product._id));
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
