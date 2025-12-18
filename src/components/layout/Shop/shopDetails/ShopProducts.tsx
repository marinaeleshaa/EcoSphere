"use client";

import { motion } from "framer-motion";
import ShopProductsSliderSection from "./ShopProductsSliderSection";
import { useTranslations } from "next-intl";
import { IShop } from "@/types/ShopTypes";

const ShopProducts = ({ shop }: { shop?: IShop }) => {
  const t = useTranslations("ShopDetails.products");
  return (
    <section className="mt-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: false }}
        className="mb-10"
      >
        <div className="mb-10">
          <h2 className="text-2xl text-center font-semibold text-foreground">
            {t("title")}
          </h2>
          <p className="text-sm text-center text-secondary-foreground">
            {t("subtitle")}
          </p>
        </div>
        <ShopProductsSliderSection products={shop?.menus || []} />
      </motion.div>
    </section>
  );
};

export default ShopProducts;
