"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import ProductCard from "@/components/layout/restaurant/products/ProductCard";
import ProductPopup from "@/components/layout/restaurant/products/ProductPopup";
import DeleteProductDialog from "@/components/layout/restaurant/products/DeleteProductDialog";

import {
  ProductResponse,
  CreateProductDTO,
} from "@/backend/features/product/dto/product.dto";
import { MenuItemCategory } from "@/backend/features/restaurant/restaurant.model";
import { Plus, Search, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function ProductsClient({
  restaurantId,
  initialProducts,
  initialMetadata,
}: {
  restaurantId: string;
  initialProducts: ProductResponse[];
  initialMetadata: any;
}) {
  const t = useTranslations("Restaurant.Products");

  const [products, setProducts] = useState<ProductResponse[]>(initialProducts);
  const [metadata, setMetadata] = useState<any>(initialMetadata);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [selectedCategory, setSelectedCategory] = useState<
    MenuItemCategory | "all"
  >("all");
  const [sort, setSort] = useState<"price" | "sustainabilityScore">(
    "price",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<
    ProductResponse | undefined
  >();
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: "12",
        search: debouncedSearch ?? "",
        ...(selectedCategory !== "all" && { category: selectedCategory }),
        sort,
        sortOrder,
      });

      const res = await fetch(
        `/api/restaurants/${restaurantId}/products?${params}`,
      );
      if (!res.ok) throw new Error();

      const { data } = await res.json();

      if (data.data) {
        setProducts(data.data);
        setMetadata(data.metadata);
      } else {
        setProducts(data);
      }
    } catch (error) {
      toast.error(t("toasts.loadError"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, debouncedSearch, selectedCategory, sort, sortOrder]);

  const handleCreate = async (payload: CreateProductDTO) => {
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      toast.success(t("toasts.createSuccess"));
      setIsPopupOpen(false);
      fetchProducts();
    } catch {
      toast.error(t("toasts.createError"));
    }
  };

  const handleUpdate = async (payload: CreateProductDTO) => {
    if (!editingProduct) return;

    try {
      const res = await fetch(
        `/api/restaurants/${restaurantId}/products/${editingProduct._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) throw new Error();

      toast.success(t("toasts.updateSuccess"));
      setEditingProduct(undefined);
      setIsPopupOpen(false);
      fetchProducts();
    } catch {
      toast.error(t("toasts.updateError"));
    }
  };

  const confirmDelete = async () => {
    if (!deleteProductId) return;

    try {
      const res = await fetch(
        `/api/restaurants/${restaurantId}/products/${deleteProductId}`,
        { method: "DELETE" },
      );

      if (!res.ok) throw new Error();

      toast.success(t("toasts.deleteSuccess"));
      setDeleteProductId(null);
      fetchProducts();
    } catch {
      toast.error(t("toasts.deleteError"));
    }
  };

  const renderProductsGrid = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-75 w-full rounded-xl" />
          ))}
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-20 text-muted-foreground">
          {t("noProducts")}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-15">
        {products.map((product) => (
          <ProductCard
            key={String(product._id)}
            product={product}
            onEdit={(p) => {
              setEditingProduct(p);
              setIsPopupOpen(true);
            }}
            onDelete={(id) => setDeleteProductId(id)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="pt-15 h-[calc(100vh-20px)] w-[80%] mx-auto flex flex-col space-y-4">
      {/* Top Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <Button
          onClick={() => setIsPopupOpen(true)}
          className="myBtnPrimary hover:scale-105 transition-transform"
        >
          <Plus className="mr-2 h-5 w-5" /> {t("addProduct")}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2 bg-card p-3 mb-5 rounded-full border border-border shadow-sm shrink-0">
        <Search className="w-5 h-5 text-muted-foreground ml-2" />
        <Input
          placeholder={t("searchPlaceholder")}
          className="border-none focus-visible:ring-0 shadow-none bg-transparent rounded-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-wrap gap-4 items-center shrink-0 mb-6">
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Label
            htmlFor="category-filter"
            className="text-sm font-medium whitespace-nowrap"
          >
            {t("filter.category")}:
          </Label>
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value as MenuItemCategory | "all");
              setPage(1);
            }}
          >
            <SelectTrigger id="category-filter" className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filter.allCategories")}</SelectItem>
              <SelectItem value="Fruits">{t("Categories.fruits")}</SelectItem>
              <SelectItem value="Vegetables">
                {t("Categories.vegetables")}
              </SelectItem>
              <SelectItem value="Meat">{t("Categories.meat")}</SelectItem>
              <SelectItem value="Dairy">{t("Categories.dairy")}</SelectItem>
              <SelectItem value="Bakery">{t("Categories.bakery")}</SelectItem>
              <SelectItem value="Beverages">
                {t("Categories.beverages")}
              </SelectItem>
              <SelectItem value="Snacks">{t("Categories.snacks")}</SelectItem>
              <SelectItem value="Other">{t("Categories.other")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2">
          <Label
            htmlFor="sort-by"
            className="text-sm font-medium whitespace-nowrap"
          >
            {t("filter.sortBy")}:
          </Label>
          <Select
            value={sort}
            onValueChange={(value) => {
              setSort(value as "price" | "sustainabilityScore");
              setPage(1);
            }}
          >
            <SelectTrigger id="sort-by" className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">
                {t("filter.sortOptions.price")}
              </SelectItem>
              <SelectItem value="sustainabilityScore">
                {t("filter.sortOptions.sustainability")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
            setPage(1);
          }}
          className="rounded-full"
          title={sortOrder === "asc" ? "Ascending" : "Descending"}
        >
          {sortOrder === "asc" ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : (
            <ArrowDownIcon className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto px-1 min-h-0">
        {renderProductsGrid()}
      </div>

      {/* Pagination */}
      {metadata && metadata.totalPages > 1 && (
        <div className="flex justify-center space-x-2 shrink-0">
          <Button
            className="myBtnPrimary"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {t("previous")}
          </Button>

          <div className="flex items-center px-4 text-sm">
            {t("page", { current: page, total: metadata.totalPages })}
          </div>

          <Button
            className="myBtnPrimary"
            disabled={page === metadata.totalPages}
            onClick={() => setPage((p) => Math.min(metadata.totalPages, p + 1))}
          >
            {t("next")}
          </Button>
        </div>
      )}

      {/* Popup */}
      <ProductPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={editingProduct ? handleUpdate : handleCreate}
        title={editingProduct ? t("popup.editTitle") : t("popup.addTitle")}
        initialData={
          editingProduct
            ? {
                title: editingProduct.title,
                subtitle: editingProduct.subtitle,
                price: editingProduct.price,
                availableOnline: editingProduct.availableOnline,
                category: editingProduct.category,
                avatar: editingProduct.avatar,
              }
            : undefined
        }
      />

      {/* Delete Dialog */}
      <DeleteProductDialog
        isOpen={!!deleteProductId}
        onClose={() => setDeleteProductId(null)}
        onConfirm={confirmDelete}
        isDeleting={loading}
        productTitle={
          products.find((p) => String(p._id) === deleteProductId)?.title
        }
      />
    </div>
  );
}
