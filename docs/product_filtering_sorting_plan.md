# Phase 2: Product Filtering, Sorting, and Category Display

## Overview

This phase adds filtering by category, sorting options, and category badge display on product cards to enhance the restaurant products management experience.

## Background

Currently, the products page supports:

- Search functionality by title/subtitle
- Pagination
- Basic sorting (sortBy and sortOrder params exist in backend)

Missing features:

- Filter by category dropdown UI
- Sort by dropdown UI
- Category display on product cards
- Category field in repository projections

## Proposed Changes

### Backend

#### [product.repository.ts](file:///e:/Graduation%20Project/EcoSphere/src/backend/features/product/product.repository.ts)

Add `category` field to projections and filtering in both `findAllProducts` and `findProductsByRestaurantId` methods.

**Add category parameter to options** (lines 41-52 and 160-172):

```typescript
const {
  page = 1,
  limit = 10,
  search = "",
  category, // NEW: Category filter
  sortBy = "title",
  sortOrder = "asc",
} = options ?? {};
```

**Add category to $project** (lines 69-81 and 189-201):

```typescript
category: "$menus.category", // NEW: Include category field
```

**Add category filter to $match** (lines 84-91 and 204-211):

```typescript
$match: {
  $and: [
    {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { subtitle: { $regex: search, $options: "i" } },
      ],
    },
    ...(category ? [{ category }] : []),
  ],
},
```

**Add category to $group** (lines 94-106):

```typescript
category: { $first: "$category" }, // NEW
```

---

#### [product.dto.ts](file:///e:/Graduation%20Project/EcoSphere/src/backend/features/product/dto/product.dto.ts)

**Update ProductPageOptions** (lines 67-73):

```typescript
export interface ProductPageOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: MenuItemCategory; // NEW: Filter by category
  sortBy?: "price" | "title" | "itemRating" | "createdAt";
  sortOrder?: "asc" | "desc";
}
```

---

### Frontend

#### [MODIFY] [ProductCard.tsx](file:///e:/Graduation%20Project/EcoSphere/src/components/layout/restaurant/products/ProductCard.tsx)

**Add category badge** (after line 89):

```tsx
{
  /* Category Badge */
}
{
  product.category && (
    <div className="absolute bottom-2 left-2 bg-primary/90 text-primary-foreground text-xs px-3 py-1 rounded-full backdrop-blur-sm shadow-md">
      {t(`Categories.${product.category.toLowerCase()}`)}
    </div>
  );
}
```

---

#### [MODIFY] [ProductsClient.tsx](file:///e:/Graduation%20Project//EcoSphere/src/components/layout/Products/ProductsClient.tsx)

**Add imports** (line 1):

```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MenuItemCategory } from "@/backend/features/restaurant/restaurant.model";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
```

**Add state** (after line 39):

```typescript
const [selectedCategory, setSelectedCategory] = useState<
  MenuItemCategory | "all"
>("all");
const [sortBy, setSortBy] = useState<"title" | "price">("title");
const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
```

**Update fetch params** (lines 51-55):

```typescript
const params = new URLSearchParams({
  page: String(page),
  limit: "12",
  search: debouncedSearch ?? "",
  ...(selectedCategory !== "all" && { category: selectedCategory }),
  sortBy,
  sortOrder,
});
```

**Update useEffect** (lines 78-80):

```typescript
useEffect(() => {
  fetchProducts();
}, [page, debouncedSearch, selectedCategory, sortBy, sortOrder]);
```

**Add filter/sort UI** (after line 201):

```tsx
{
  /* Filters and Sorting */
}
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
        <SelectItem value="Vegetables">{t("Categories.vegetables")}</SelectItem>
        <SelectItem value="Meat">{t("Categories.meat")}</SelectItem>
        <SelectItem value="Dairy">{t("Categories.dairy")}</SelectItem>
        <SelectItem value="Bakery">{t("Categories.bakery")}</SelectItem>
        <SelectItem value="Beverages">{t("Categories.beverages")}</SelectItem>
        <SelectItem value="Snacks">{t("Categories.snacks")}</SelectItem>
        <SelectItem value="Other">{t("Categories.other")}</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Sort By */}
  <div className="flex items-center gap-2">
    <Label htmlFor="sort-by" className="text-sm font-medium whitespace-nowrap">
      {t("filter.sortBy")}:
    </Label>
    <Select
      value={sortBy}
      onValueChange={(value) => {
        setSortBy(value as "title" | "price");
        setPage(1);
      }}
    >
      <SelectTrigger id="sort-by" className="w-[150px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="title">{t("filter.sortOptions.name")}</SelectItem>
        <SelectItem value="price">{t("filter.sortOptions.price")}</SelectItem>
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
</div>;
```

---

### Localization

#### [MODIFY] `messages/en.json`

Add under `Restaurant.Products`:

```json
"filter": {
  "category": "Category",
  "allCategories": "All Categories",
  "sortBy": "Sort By",
  "sortOptions": {
    "name": "Name",
    "price": "Price"
  }
}
```

#### [MODIFY] `messages/ar.json`

Add under `Restaurant.Products`:

```json
"filter": {
  "category": "الفئة",
  "allCategories": "جميع الفئات",
  "sortBy": "الترتيب حسب",
  "sortOptions": {
    "name": "الاسم",
    "price": "السعر"
  }
}
```

## Verification Plan

### Manual Verification

#### Test 1: Category Display

1. Navigate to `/[locale]/restaurant/products`
2. View products
3. **Expected**: Each product card shows category badge in bottom-left with translated category name

#### Test 2: Filter by Category

1. Select "Fruits" from category dropdown
2. **Expected**: Only fruits products shown
3. Select "All Categories"
4. **Expected**: All products shown

#### Test 3: Sort by Name

1. Select "Sort By: Name"
2. Toggle sort order button
3. **Expected**: Products sorted alphabetically (A-Z or Z-A)

#### Test 4: Sort by Price

1. Select "Sort By: Price"
2. Toggle sort order
3. **Expected**: Products sorted by price (low-high or high-low)

#### Test 5: Combined Filtering + Sorting

1. Filter by "Beverages"
2. Sort by "Price" descending
3. **Expected**: Only beverages shown, sorted highest to lowest price

#### Test 6: Pagination Persistence

1. Apply category filter
2. Navigate to page 2
3. **Expected**: Filter persists, showing filtered results on page 2

#### Test 7: Arabic Localization

1. Switch to Arabic
2. **Expected**: Category badges, filter labels, and dropdown options all in Arabic
