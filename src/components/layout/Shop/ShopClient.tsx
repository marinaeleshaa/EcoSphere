"use client";
import { useTranslations } from "next-intl";
import HeroSection from "../common/HeroSection";
import ShopHero from "./ShopHero";
import ShopSection from "./ShopSection";
import { IShop, SortOption } from "@/types/ShopTypes";
import { useEffect, useState } from "react";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PaginatedShopResponse {
  data: IShop[];
  metadata: PaginationMeta;
}

function ShopClient() {
  const t = useTranslations("Shop.hero");

  const [shops, setShops] = useState<IShop[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState<SortOption>("default");
  const [search, setSearch] = useState("");

  const getShops = async (
    page = 1,
    sortOption: SortOption = "default",
    searchQuery = ""
  ): Promise<PaginatedShopResponse> => {
    setLoading(true);

    const queryParams = new URLSearchParams();
    queryParams.set("page", page.toString());
    queryParams.set("limit", "6");
    if (sortOption !== "default") queryParams.set("sort", sortOption);
    if (searchQuery) queryParams.set("search", searchQuery);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_APP_URL
        }/api/shops?${queryParams.toString()}`,
        { cache: "no-cache" }
      );
      if (!response.ok) throw new Error("Failed to fetch shops");

      const { data, success } = await response.json();

      if (!success)
        return {
          data: [],
          metadata: { total: 0, page: 1, limit: 10, totalPages: 0 },
        };
      return Array.isArray(data)
        ? {
            data,
            metadata: {
              total: data.length,
              page: 1,
              limit: data.length,
              totalPages: 1,
            },
          }
        : data;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchShops = async () => {
      try {
        const res = await getShops(page, sort, search);
        if (!isMounted) return;
        setShops(res.data);
        setTotalPages(res.metadata.totalPages);
      } catch (err) {
        console.error(err);
      }
    };

    fetchShops();
    return () => {
      isMounted = false;
    };
  }, [page, sort, search]);

  return (
    <>
      <HeroSection
        title={t("title")}
        subTitle={t("subtitle")}
        imgUrl="/s.png"
      />
      <ShopHero />
      <ShopSection
        shops={shops}
        loading={loading}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        currentSort={sort}
        onSortChange={setSort}
        searchQuery={search}
        onSearchChange={setSearch}
      />
    </>
  );
}

export default ShopClient;
