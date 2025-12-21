"use client";

import { useRef } from "react";
import ProductCard from "../../Store/ProductCard";
import { useTranslations } from "next-intl";
import { IProduct } from "@/types/ProductType";

const ShopProductsSliderSection = ({ products }: { products: IProduct[] }) => {
  const t = useTranslations("ShopDetails.products");
  const sliderRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">{t("noProducts")}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        ref={sliderRef}
        className="overflow-x-auto scroll-smooth scrollbar-hide py-5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex flex-nowrap gap-5 py-5 w-80%">
          {products.map((product) => (
            <div key={product.id} className="shrink-0 w-65">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ShopProductsSliderSection;
