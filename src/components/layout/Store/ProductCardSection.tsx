"use client";
import { IProduct } from "@/types/ProductType";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
import { products } from "@/data/products";



const ProductCardSection = () => {
  return (
    <section>
      <div className="w-[80%] mx-auto">
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-15">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: index * 0.1, 
              }}
              viewport={{ once: true }}
            >
              <ProductCard {...product}  />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCardSection;
