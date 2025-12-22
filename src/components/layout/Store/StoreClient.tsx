"use client";

import { useState, useEffect } from "react";
import { getProducts } from "@/frontend/api/Store";
import ProductCardSection from "./ProductCardSection";
import Pagination from "@/components/ui/Pagination";
import { IProduct } from "@/types/ProductType";

export default function StoreClient() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await getProducts({
          page: currentPage,
          limit: itemsPerPage,
        });

        // Handle both array and paginated response formats
        if (response.success) {
          const result = response.data;
          if (Array.isArray(result)) {
            setProducts(result);
            setTotalPages(1);
          } else {
            setProducts(result.data);
            setTotalPages(result.metadata.totalPages);
          }
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of products section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="w-[80%] mx-auto flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="w-[80%] mx-auto">
      <ProductCardSection products={products} />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
