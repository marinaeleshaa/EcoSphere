"use client";

import { useRef } from "react";
import ProductCard from "../ProductCard";

import { IProduct } from "@/types/ProductType";

interface ProductSliderSectionProps {
  products: IProduct[];
}

const ProductSliderSection = ({ products }: ProductSliderSectionProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full  ">
      <div
        ref={sliderRef}
        className="overflow-x-auto scroll-smooth scrollbar-hide py-5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex flex-nowrap gap-5 py-5 ">
          {products.map((p) => (
            <div key={p.id} className="shrink-0 w-65">
              <ProductCard product={p} />
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

export default ProductSliderSection;
