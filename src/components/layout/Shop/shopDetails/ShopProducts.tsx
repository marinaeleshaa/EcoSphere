"use client";

import { motion } from "framer-motion";
import ShopProductsSliderSection from "./ShopProductsSliderSection";

const ShopProducts = ({ shopName }: { shopName?: string }) => {
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
          Shop Products
        </h2>
        <p className="text-sm text-center text-secondary-foreground">
          explore products from this shop
        </p>
     </div>
        <ShopProductsSliderSection shopName={shopName} />
      </motion.div>
    </section>
  );
};

export default ShopProducts;
