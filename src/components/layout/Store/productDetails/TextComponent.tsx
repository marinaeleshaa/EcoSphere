"use client";
import { IProduct } from "@/types/ProductType";
import { motion } from "framer-motion";
import React from "react";
import { useTranslations } from 'next-intl';

const TextComponent = ({ product }: { product: IProduct }) => {
  const t = useTranslations('ProductDetails.tabs');
  const [activeTab, setActiveTab] = React.useState<"description" | "reviews">(
    "description"
  );
  return (
    <section className="my-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center justify-center gap-5 capitalize text-foreground text-lg md:text-xl border-b-2 p-5 border-primary">
          <button
            className={`cursor-pointer capitalize ${activeTab === "description"
                ? "text-primary underline underline-offset-8"
                : ""
              }`}
            onClick={() => setActiveTab("description")}
          >
            {t('description')}
          </button>
          <button
            className={`cursor-pointer capitalize ${activeTab === "reviews"
                ? "text-primary underline underline-offset-8"
                : ""
              }`}
            onClick={() => setActiveTab("reviews")}
          >
            {" "}
            {t('reviews')}
          </button>
        </div>
        <div>
          {activeTab === "description" && (
            <div className="my-5 text-secondary-foreground text-md md:text-lg leading-8">
              {product.productDescription}
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="my-5 text-secondary-foreground text-md md:text-lg leading-8">
              {t('reviewsComingSoon')}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default TextComponent;
