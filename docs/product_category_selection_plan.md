# Product Category Selection Implementation Plan

## Overview

This plan outlines the implementation of category selection functionality for restaurant menu items on the products page. The feature will allow restaurant owners to select from predefined categories when adding or editing products.

## Background

Currently, the `restaurant.model.ts` defines a `MenuItemCategory` type with the following categories:

- Fruits
- Vegetables
- Meat
- Dairy
- Beverages
- Snacks
- Other

The `menuItemSchema` includes a `category` field that is **required** and enforced at the database level. However, the frontend form ([ProductPopup.tsx](file:///e:/Graduation%20Project/EcoSphere/src/components/layout/restaurant/products/ProductPopup.tsx)) does not provide a UI element for users to select this category when creating or editing products.

> [!IMPORTANT]
> There is a **discrepancy** between the schema definition and the TypeScript types:
>
> - **TypeScript Type** (`MenuItemCategory` in [restaurant.model.ts:12-19](file:///e:/Graduation%20Project/EcoSphere/src/backend/features/restaurant/restaurant.model.ts#L12-L19)): Includes `Bakery` but not `Beverages`
> - **Mongoose Schema** ([restaurant.model.ts:87-98](file:///e:/Graduation%20Project/EcoSphere/src/backend/features/restaurant/restaurant.model.ts#L87-L98)): Includes `Beverages` but not `Bakery`
>
> This inconsistency must be resolved before implementation.

## User Review Required

> [!WARNING] > **Category Type Inconsistency**
>
> The `MenuItemCategory` TypeScript type and the Mongoose schema enum have different values. We need to decide which set of categories to use:
>
> **Option A - Use TypeScript Type (Current)**
>
> - Fruits, Vegetables, Meat, Dairy, **Bakery**, Snacks, Other (no Beverages)
>
> **Option B - Use Schema Enum (Current)**
>
> - Fruits, Vegetables, Meat, Dairy, **Beverages**, Snacks, Other (no Bakery)
>
> **Recommendation**: Use a combined set that includes both Bakery AND Beverages, as both are common restaurant categories. This would give us:
>
> - Fruits, Vegetables, Meat, Dairy, Bakery, Beverages, Snacks, Other

## Proposed Changes

### Backend

#### [restaurant.model.ts](file:///e:/Graduation%20Project/EcoSphere/src/backend/features/restaurant/restaurant.model.ts)

**Lines 12-19**: Update the `MenuItemCategory` type to include both `Bakery` and `Beverages`

```typescript
export type MenuItemCategory =
  | "Fruits"
  | "Vegetables"
  | "Meat"
  | "Dairy"
  | "Bakery"
  | "Beverages"
  | "Snacks"
  | "Other";
```

**Lines 87-98**: Update the schema enum to match the TypeScript type

```typescript
category: {
  type: String,
  enum: [
    "Fruits",
    "Vegetables",
    "Meat",
    "Dairy",
    "Bakery",
    "Beverages",
    "Snacks",
    "Other",
  ],
  required: true,
},
```

---

#### [product.dto.ts](file:///e:/Graduation%20Project/EcoSphere/src/backend/features/product/dto/product.dto.ts)

**Lines 51-62**: Add `category` field to `CreateProductDTO`

```typescript
export interface CreateProductDTO {
  title: string;
  subtitle: string;
  price: number;
  category: MenuItemCategory; // NEW: Required category field
  avatar?: {
    key: string;
    url?: string;
  };
  availableOnline?: boolean;
  sustainabilityScore?: number;
  sustainabilityReason?: string;
}
```

Import the `MenuItemCategory` type at the top of the file:

```typescript
import { IMenuItem, MenuItemCategory } from "../../restaurant/restaurant.model";
```

### Frontend

#### [NEW] `src/components/layout/restaurant/products/CategorySelect.tsx`

Create a new reusable category selection component using shadcn/ui Select component:

```tsx
"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuItemCategory } from "@/backend/features/restaurant/restaurant.model";
import { useTranslations } from "next-intl";

interface CategorySelectProps {
  value: MenuItemCategory | undefined;
  onChange: (value: MenuItemCategory) => void;
  error?: string;
}

const CATEGORIES: MenuItemCategory[] = [
  "Fruits",
  "Vegetables",
  "Meat",
  "Dairy",
  "Bakery",
  "Beverages",
  "Snacks",
  "Other",
];

export default function CategorySelect({
  value,
  onChange,
  error,
}: CategorySelectProps) {
  const t = useTranslations("Restaurant.Products.Categories");

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={error ? "border-red-500" : ""}>
          <SelectValue placeholder={t("placeholder")} />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {t(category.toLowerCase())}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
```

#### [MODIFY] [ProductPopup.tsx](file:///e:/Graduation%20Project/EcoSphere/src/components/layout/restaurant/products/ProductPopup.tsx)

**Lines 1-22**: Add imports for CategorySelect and MenuItemCategory

```typescript
import CategorySelect from "./CategorySelect";
import { MenuItemCategory } from "@/backend/features/restaurant/restaurant.model";
```

**Lines 38-45**: Update default values to include category

```typescript
const {
  register,
  handleSubmit,
  reset,
  setValue,
  watch,
  formState: { errors, isSubmitting },
} = useForm<CreateProductDTO>({
  defaultValues: initialData || {
    title: "",
    subtitle: "",
    price: 0,
    availableOnline: true,
    category: undefined, // NEW: default to undefined to force selection
  },
});
```

**Lines 47-49**: Add category state management

```typescript
const [imageKey, setImageKey] = React.useState<string | undefined>(
  initialData?.avatar?.key
);
const [selectedCategory, setSelectedCategory] = React.useState<
  MenuItemCategory | undefined
>(initialData?.category);
```

**Lines 68-74**: Update form submit to include category validation

```typescript
const handleFormSubmit = async (data: CreateProductDTO) => {
  if (!selectedCategory) {
    // This should be caught by validation, but as a safeguard
    return;
  }
  if (imageKey) {
    data.avatar = { key: imageKey };
  }
  data.category = selectedCategory;
  await onSubmit(data);
  onClose();
};
```

**Between lines 131-148**: Add category selection field (after price field, before image upload)

```tsx
<div className="space-y-2">
  <Label htmlFor="category">{t("popup.categoryLabel")}</Label>
  <CategorySelect
    value={selectedCategory}
    onChange={(value) => setSelectedCategory(value)}
    error={
      !selectedCategory && isSubmitting
        ? t("popup.errors.categoryRequired")
        : undefined
    }
  />
</div>
```

#### [MODIFY] [ProductsClient.tsx](file:///e:/Graduation%20Project/EcoSphere/src/components/layout/Products/ProductsClient.tsx)

**Lines 239-249**: Update `initialData` to include `category`

```typescript
initialData={
  editingProduct
    ? {
        title: editingProduct.title,
        subtitle: editingProduct.subtitle,
        price: editingProduct.price,
        availableOnline: editingProduct.availableOnline,
        category: editingProduct.category, // NEW: pass category for editing
        avatar: editingProduct.avatar,
      }
    : undefined
}
```

---

### Localization

#### [MODIFY] `messages/en.json`

Add translations under the `Restaurant.Products` section:

```json
{
  "Restaurant": {
    "Products": {
      "popup": {
        "categoryLabel": "Category",
        "errors": {
          "categoryRequired": "Please select a category"
        }
      },
      "Categories": {
        "placeholder": "Select a category",
        "fruits": "Fruits",
        "vegetables": "Vegetables",
        "meat": "Meat",
        "dairy": "Dairy",
        "bakery": "Bakery",
        "beverages": "Beverages",
        "snacks": "Snacks",
        "other": "Other"
      }
    }
  }
}
```

#### [MODIFY] `messages/ar.json`

Add Arabic translations:

```json
{
  "Restaurant": {
    "Products": {
      "popup": {
        "categoryLabel": "الفئة",
        "errors": {
          "categoryRequired": "يرجى اختيار فئة"
        }
      },
      "Categories": {
        "placeholder": "اختر فئة",
        "fruits": "فواكه",
        "vegetables": "خضروات",
        "meat": "لحوم",
        "dairy": "ألبان",
        "bakery": "مخبوزات",
        "beverages": "مشروبات",
        "snacks": "وجبات خفيفة",
        "other": "أخرى"
      }
    }
  }
}
```

## Verification Plan

### Automated Tests

> [!NOTE]
> No existing automated tests were found for the product creation/editing flow. Manual verification will be the primary method for this feature.

### Manual Verification

#### Test Case 1: Create New Product with Category

1. Navigate to the restaurant products page: `/[locale]/restaurant/products`
2. Click the "Add Product" button
3. Fill in the form:
   - Title: "Fresh Orange Juice"
   - Subtitle: "Freshly squeezed orange juice"
   - Price: 5.99
   - **Category: Select "Beverages"** ← NEW FIELD
   - Upload an image (optional)
   - Keep "Available Online" checked
4. Click "Save"
5. **Expected Result**:
   - Product is created successfully
   - Toast message shows "Product created successfully"
   - Product appears in the list

#### Test Case 2: Verify Category is Required

1. Click "Add Product"
2. Fill in title, subtitle, and price
3. **Do NOT select a category**
4. Click "Save"
5. **Expected Result**:
   - Validation error appears: "Please select a category"
   - Form is not submitted

#### Test Case 3: Edit Existing Product Category

1. Find an existing product in the list
2. Click the edit button
3. **Expected Result**: The category dropdown should show the product's current category
4. Change the category to a different value (e.g., from "Beverages" to "Snacks")
5. Click "Save"
6. **Expected Result**: Product is updated with the new category

#### Test Case 4: Category Localization

1. Switch language to Arabic (ar)
2. Click "Add Product"
3. **Expected Result**: Category dropdown shows Arabic translations:
   - "فواكه" for Fruits
   - "خضروات" for Vegetables
   - etc.
4. Switch to French (fr)
5. **Expected Result**: Category dropdown shows French translations

#### Test Case 5: Backend Validation

1. Open browser DevTools Network tab
2. Create a product and select "Dairy" category
3. Inspect the POST request to `/api/restaurants/[id]/products`
4. **Expected Result**: Request payload includes `"category": "Dairy"`
5. Check the database (if accessible)
6. **Expected Result**: The menu item document has the correct category field

#### Test Case 6: All Categories Available

1. Open the category dropdown in the product form
2. **Expected Result**: Verify all 8 categories appear:
   - Fruits
   - Vegetables
   - Meat
   - Dairy
   - Bakery
   - Beverages
   - Snacks
   - Other

### Database Verification

After implementing changes:

1. Create a test product with each category
2. Query the database directly to verify the category field is saved correctly
3. Ensure existing products without categories can be edited to add a category

## Migration Considerations

> [!CAUTION] > **Existing Data Impact**
>
> If there are any existing menu items in the database that do NOT have a `category` field, they will fail validation when edited. Consider running a migration script to set a default category (e.g., "Other") for existing items without a category.

### Optional: Migration Script

If needed, create a script to update existing menu items:

```javascript
// scripts/migrate-add-default-categories.js
db.restaurants.updateMany(
  { "menus.category": { $exists: false } },
  { $set: { "menus.$[].category": "Other" } }
);
```

## Summary

This implementation adds category selection to the product creation/editing flow by:

1. Resolving the TypeScript/Schema category inconsistency
2. Adding the `category` field to the DTO
3. Creating a reusable `CategorySelect` component
4. Integrating the component into `ProductPopup`
5. Adding full localization support (en/ar/fr)
6. Ensuring proper validation and error handling
