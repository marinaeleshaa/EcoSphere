import { useState } from "react";
import ShopCard from "./ShopCard";
import FilterBar from "./FilterBar";
import { motion } from "framer-motion";
import { shops } from "@/data/shops";

export default function ShopSection() {
  const [currentSort, setCurrentSort] = useState("Default"); // New state for sorting
  const [searchQuery, setSearchQuery] = useState("");

  const processedShops = shops.filter((shop) => {
    const passesSearch =
      shop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return passesSearch;
  });

  const sortedShops = [...processedShops].sort((a, b) => {
    if (currentSort === "Highest Rating") {
      return b.rating - a.rating;
    }
    if (currentSort === "Lowest Rating") {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 auto-rows-auto w-[80%] mx-auto mb-4">
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
          <p className="col-span-full text-center text-primary-forground py-10">
            No products match your current search criteria.
          </p>
        )}
      </div>
    </>
  );
}
