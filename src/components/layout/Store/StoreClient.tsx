"use client";

import { useState, useEffect } from "react";
import { getProducts } from "@/frontend/api/Store";
import ProductFilterBar, {
  ProductCategoryOption,
  ProductSortOption,
} from "./ProductFilterBar";
import ProductCardSection from "./ProductCardSection";
import Pagination from "@/components/ui/Pagination";
import { IProduct } from "@/types/ProductType";

import { useTranslations } from "next-intl";

export default function StoreClient() {
  const t = useTranslations("Store.filter");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState<ProductSortOption>("default");
  const [category, setCategory] = useState<ProductCategoryOption>("default");

  const itemsPerPage = 8;

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await getProducts({
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearch,
          sort,
          category,
        });
        if (isMounted && response.success) {
          const result = response.data;

          if (Array.isArray(result)) {
            setProducts([...result]);
            setTotalPages(1);
          } else {
            setProducts([...result.data]);
            setTotalPages(result.metadata.totalPages || 1);
          }
        }
      } catch (error) {
        if (isMounted) console.error("Failed to fetch products:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [currentPage, debouncedSearch, sort, category]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSort: ProductSortOption) => {
    setSort(newSort);
    setCurrentPage(1);
  };

  const handleCategoryChange = (newCategory: ProductCategoryOption) => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setCurrentPage(1);
  };

  return (
    <div className="w-[80%] mx-auto">
      <ProductFilterBar
        onSortChange={handleSortChange}
        onCategoryChange={handleCategoryChange}
        onSearch={handleSearchChange}
        currentSort={sort}
        currentCategory={category}
        searchValue={search}
      />

      <div className="relative min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <ProductCardSection
              key={`${debouncedSearch}-${sort}-${category}-${currentPage}`}
              products={products}
            />
            {products.length === 0 && (
              <p className="text-center text-foreground py-10">
                {t("noProducts")}
              </p>
            )}
          </>
        )}
      </div>
      <div className="flex justify-center mt-8 mb-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages > 0 ? totalPages : 1}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
