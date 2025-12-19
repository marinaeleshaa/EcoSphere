"use client";
import { IProduct } from "@/types/ProductType";
import { motion } from "framer-motion";
import React from "react";
import ProductReviews from "./ProductReviews";

const TextComponent = ({ product }: { product: IProduct }) => {
  const { id } = product;

  // Defensive fallback for ID
  const safeId = id || (product as any)._id;

  return (
    <section className="my-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <ProductReviews reviews={product.itemRating || []} productId={safeId} />
      </motion.div>
    </section>
  );
};

export default TextComponent;
