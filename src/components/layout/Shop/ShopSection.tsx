import { useState } from "react";
import ShopCard from "./ShopCard";
import FilterBar from "./FilterBar";
import { motion } from "framer-motion";
import { shops } from "@/data/shops";
import { useTranslations } from "next-intl";

export default function ShopSection() {
  const t = useTranslations('Shop.filter');
  const [currentSort, setCurrentSort] = useState(t('sortOptions.default')); // New state for sorting
  const [searchQuery, setSearchQuery] = useState("");

  const processedShops = shops.filter((shop) => {
    return (
      shop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedShops = [...processedShops].sort((a, b) => {
    if (currentSort === t('sortOptions.highestRating')) {
      return b.rating - a.rating;
    }
    if (currentSort === t('sortOptions.lowestRating')) {
      return a.rating - b.rating;
    }

    return 0;
  });

  return (
    <>
      <FilterBar
        onSortChange={setCurrentSort}
        onSearch={setSearchQuery}
        isSorting={true}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-15 auto-rows-auto w-[80%] mx-auto mb-4">
        {sortedShops.length > 0 ? (
          sortedShops.map((shop, index) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ShopCard shop={shop} index={index} />
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-primary py-10">
            {t('noProducts')}
          </p>
        )}
      </div>
    </>
  );
}
