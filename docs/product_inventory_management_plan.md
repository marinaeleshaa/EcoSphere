# Product Inventory Management Implementation Plan

## Overview

This plan outlines the implementation of a product inventory/stock management system for restaurant menu items. The system will track available quantity for each product, enforce stock limits in the cart, display stock status, and automatically decrease inventory after successful orders.

## Background

Currently, the system has:

- Menu items (products) with basic fields: title, subtitle, price, category, avatar, etc.
- Redux-based cart system with CartSlice managing cart items
- Checkout flow with Stripe payment integration
- No inventory tracking or stock management

Missing functionality:

- **Quantity field** on menu items to track available stock
- **Stock status** (In Stock / Out of Stock) based on quantity
- **Quantity validation** when adding to cart
- **Stock decrease** after successful checkout
- **UI indicators** for stock status and limits

## User Review Required

> [!IMPORTANT] > **Stock Decrease Timing - DECISION CONFIRMED**
>
> **Selected: Option B** - Decrease stock only after payment is confirmed
>
> - Stock will be decreased in the payment success webhook/callback
> - Prevents locking inventory for failed/abandoned payments
> - Includes validation to handle concurrent purchases

> [!WARNING] > **Concurrent Purchase Risk**
>
> If two users try to buy the last item simultaneously, there's a race condition. We will handle this by:
>
> - Using atomic MongoDB operations with stock validation in the order creation endpoint
> - Returning appropriate error if stock is insufficient at checkout time

## Proposed Changes

### Backend

#### [restaurant.model.ts](file:///e:/Graduation%20Project/EcoSphere/src/backend/features/restaurant/restaurant.model.ts)

**Add to IMenuItem interface** (after line 27):

```typescript
export interface IMenuItem extends Document {
  title: string;
  subtitle: string;
  price: number;
  category: MenuItemCategory;
  avatar?: {
    key: string;
    url?: string;
  };
  availableOnline: boolean;
  sustainabilityScore?: number;
  sustainabilityReason?: string;
  itemRating?: IItemRating[];
  quantity: number; // NEW: Available stock quantity
  inStock: boolean; // NEW: Computed field based on quantity
}
```

**Update menuItemSchema** (after line 102):

```typescript
export const menu ItemSchema = new Schema<IMenuItem>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  price: { type: Number, required: true },
  // ... existing fields ...
  quantity: { type: Number, required: true, default: 1, min: 0 }, // NEW
  // Note: inStock will be a virtual/computed field
});

// Add virtual field for inStock
menuItemSchema.virtual('inStock').get(function() {
  return this.quantity > 0;
});

// Ensure virtuals are included in JSON/Object conversion
menuItemSchema.set('toJSON', { virtuals: true });
menuItemSchema.set('toObject', { virtuals: true });
```

---

#### [product.dto.ts](file:///e:/Graduation%20Project/EcoSphere/src/backend/features/product/dto/product.dto.ts)

**Update ProductResponse interface** (after line 43):

```typescript
export interface ProductResponse {
  _id: mongoose.Types.ObjectId;
  restaurantId?: mongoose.Types.ObjectId;
  restaurantName?: string;
  title: string;
  subtitle: string;
  price: number;
  category: MenuItemCategory;
  avatar?: {
    key: string;
    url?: string;
  };
  availableOnline: boolean;
  sustainabilityScore?: number;
  sustainabilityReason?: string;
  itemRating?: number;
  quantity: number; // NEW
  inStock: boolean; // NEW
}
```

**Update CreateProductDTO** (after line 62):

```typescript
export interface CreateProductDTO {
  title: string;
  subtitle: string;
  price: number;
  category: MenuItemCategory;
  quantity?: number; // NEW: Optional, defaults to 1
  avatar?: {
    key: string;
    url?: string;
  };
  availableOnline?: boolean;
  sustainabilityScore?: number;
  sustainabilityReason?: string;
}
```

---

#### [product.repository.ts](file:///e:/Graduation%20Project/EcoSphere/src/backend/features/product/product.repository.ts)

**Update projections in findAllProducts** (lines 69-83):

```typescript
$project: {
  _id: "$menus._id",
  restaurantId: "$_id",
  restaurantName: "$name",
  title: "$menus.title",
  subtitle: "$menus.subtitle",
  price: "$menus.price",
  category: "$menus.category",
  quantity: "$menus.quantity", // NEW
  inStock: { $gt: ["$menus.quantity", 0] }, // NEW: Computed in aggregation
  avatar: "$menus.avatar",
  availableOnline: "$menus.availableOnline",
  sustainabilityScore: "$menus.sustainabilityScore",
  sustainabilityReason: "$menus.sustainabilityReason",
  itemRating: "$menus.itemRating",
},
```

**Update findProductsByRestaurantId** (similar projection changes)

**Add new method for stock update**:

```typescript
async decreaseStock(
  restaurantId: string,
  productId: string,
  quantityToDecrease: number
): Promise<IRestaurant | null> {
  await DBInstance.getConnection();

  // Use atomic operation to prevent race conditions
  return await RestaurantModel.findOneAndUpdate(
    {
      _id: restaurantId,
      "menus._id": productId,
      "menus.quantity": { $gte: quantityToDecrease } // Ensure enough stock
    },
    {
      $inc: { "menus.$.quantity": -quantityToDecrease }
    },
    { new: true }
  ).exec();
}
```

---

#### [NEW] Create Order/Payment Success Handler

**Location:** `src/backend/features/order/` or within product service

Create endpoint/service method to:

1. Receive payment confirmation
2. Extract cart items and quantities from order
3. Call `decreaseStock` for each product
4. Handle stock validation errors

---

### Frontend - Restaurant Dashboard

#### [ProductCard.tsx](file:///e:/Graduation%20Project/EcoSphere/src/components/layout/restaurant/products/ProductCard.tsx)

**Display quantity** (after price, around line 103):

```tsx
<div className="flex justify-between items-center mb-2">
  <span className="text-sm text-muted-foreground">
    {t("stock")}: {product.quantity}
  </span>
  {!product.inStock && (
    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
      {t("outOfStock")}
    </span>
  )}
</div>
```

---

#### [ProductPopup.tsx](file:///e:/Graduation%20Project/EcoSphere/src/components/layout/restaurant/products/ProductPopup.tsx)

**Add quantity state** (after category state):

```typescript
const [quantity, setQuantity] = useState<number>(initialData?.quantity ?? 1);
```

**Add quantity input field** (after category field):

```tsx
<div className="space-y-2">
  <Label htmlFor="quantity">{t("popup.quantityLabel")}</Label>
  <Input
    id="quantity"
    type="number"
    min="0"
    value={quantity}
    onChange={(e) => setQuantity(Number(e.target.value))}
    placeholder={t("popup.quantityPlaceholder")}
  />
</div>
```

**Include quantity in form submission**:

```typescript
data.quantity = quantity;
```

---

#### [ProductsClient.tsx](file:///e:/Graduation%20Project/EcoSphere/src/components/layout/Products/ProductsClient.tsx)

**Pass quantity in initialData** (around line 247):

```typescript
initialData={
  editingProduct
    ? {
        title: editingProduct.title,
        subtitle: editingProduct.subtitle,
        price: editingProduct.price,
        availableOnline: editingProduct.availableOnline,
        category: editingProduct.category,
        quantity: editingProduct.quantity, // NEW
        avatar: editingProduct.avatar,
      }
    : undefined
}
```

---

### Frontend - Cart & Checkout

#### [CartSlice.ts](file:///e:/Graduation%20Project/EcoSphere/src/frontend/redux/Slice/CartSlice.ts)

**Update IProductCart interface** (if not already there):

```typescript
export interface IProductCart {
  id: string;
  title: string;
  price: number;
  img: string;
  quantity: number; // This is the quantity user wants to buy
  maxQuantity: number; // NEW: Available stock limit
  inStock: boolean; // NEW
}
```

**Validate quantity when adding to cart**:

```typescript
addItem(state, action: PayloadAction<IProductCart>) {
  const item = action.payload;

  if (!item.inStock || item.quantity > item.maxQuantity) {
    console.warn("Cannot add item: out of stock or quantity exceeds limit");
    return;
  }

  const existingItem = state.items[item.id];
  if (existingItem) {
    const newQuantity = existingItem.quantity + item.quantity;
    if (newQuantity <= item.maxQuantity) {
      existingItem.quantity = newQuantity;
    } else {
      console.warn("Cannot add more: exceeds available stock");
    }
  } else {
    state.items[item.id] = item;
  }
}
```

---

#### [ProductsSection.tsx](file:///e:/Graduation%20Project/EcoSphere/src/components/layout/cart/ProductsSection.tsx)

> [!NOTE] > **Minimal UI Changes**
>
> To respect the existing cart design, we'll only add backend validation. The UI remains mostly the same with subtle enhancements:
>
> - Quantity input respects max limit (backend validation)
> - Small warning text only if user hits the limit (optional)

**Update quantity input validation** (keep existing UI, add max validation):

```tsx
<Input
  type="number"
  min="1"
  max={product.maxQuantity} // NEW: Add max attribute
  value={product.quantity}
  onChange={(e) => {
    const newQty = Number(e.target.value);
    // Backend will validate, but we can prevent UI issues
    if (newQty <= product.maxQuantity && newQty >= 1) {
      handleQuantityChange(product.id, newQty);
    }
  }}
  className="..." // Keep existing styling
/>;

{
  /* Optional: Only show if user tries to exceed */
}
{
  product.quantity >= product.maxQuantity && (
    <p className="text-xs text-muted-foreground mt-1">
      {t("Cart.maxStockReached")}
    </p>
  );
}
```

**Alternative: No UI changes, backend-only validation**

- Keep cart UI exactly as is
- Backend validates stock when syncing cart or during checkout
- Return error message if quantity exceeds stock
- This approach requires zero cart component changes

---

### Frontend - Store/Shop Pages

#### [ProductCard.tsx](file:///e:/Graduation%20Project/EcoSphere/src/components/layout/Store/Products/ProductCard.tsx) (Customer-facing)

**Display stock status**:

```tsx
{
  !product.inStock ? (
    <Button disabled className="w-full">
      {t("outOfStock")}
    </Button>
  ) : (
    <Button onClick={() => addToCart(product)}>{t("addToCart")}</Button>
  );
}
{
  product.inStock && product.quantity < 10 && (
    <span className="text-xs text-orange-500">
      {t("limitedStock", { quantity: product.quantity })}
    </span>
  );
}
```

---

### Localization

#### [en.json](file:///e:/Graduation%20Project/EcoSphere/src/messages/en.json)

```json
{
  "Restaurant": {
    "Products": {
      "stock": "Stock",
      "outOfStock": "Out of Stock",
      "popup": {
        "quantityLabel": "Quantity",
        "quantityPlaceholder": "Available quantity",
        "errors": {
          "quantityRequired": "Quantity is required",
          "quantityNegative": "Quantity cannot be negative"
        }
      }
    }
  },
  "Cart": {
    "maxStockReached": "Maximum available stock",
    "limitedStock": "Only {quantity} left in stock"
  },
  "Store": {
    "outOfStock": "Out of Stock",
    "limitedStock": "Only {quantity} left"
  }
}
```

#### [ar.json](file:///e:/Graduation%20Project/EcoSphere/src/messages/ar.json)

```json
{
  "Restaurant": {
    "Products": {
      "stock": "المخزون",
      "outOfStock": "نفذت الكمية",
      "popup": {
        "quantityLabel": "الكمية",
        "quantityPlaceholder": "الكمية المتاحة",
        "errors": {
          "quantityRequired": "الكمية مطلوبة",
          "quantityNegative": "الكمية لا يمكن أن تكون سالبة"
        }
      }
    }
  },
  "Cart": {
    "maxStockReached": "الحد الأقصى للمخزون المتاح",
    "limitedStock": "متبقي {quantity} فقط"
  },
  "Store": {
    "outOfStock": "نفذت الكمية",
    "limitedStock": "متبقي {quantity} فقط"
  }
}
```

---

## Verification Plan

### Test Case 1: Add Quantity to New Product

1. Navigate to `/[locale]/restaurant/products`
2. Click "Add Product"
3. Fill in required fields (title, subtitle, price, category)
4. **Leave quantity empty or set to a specific number (e.g., 10)**
5. Click "Save"
6. **Expected**:
   - Product created with quantity = 10 (or 1 if left empty)
   - Product card shows "Stock: 10"

### Test Case 2: Edit Product Quantity

1. Find an existing product
2. Click "Edit"
3. Change quantity to 5
4. Click "Save"
5. **Expected**: Product shows "Stock: 5"

### Test Case 3: Stock Status Display

1. Edit a product and set quantity to 0
2. **Expected**: Product card shows "Out of Stock" badge
3. Set quantity to 5
4. **Expected**: "Out of Stock" badge disappears, shows "Stock: 5"

### Test Case 4: Add to Cart with Stock Limit

1. As a customer, navigate to store page
2. Find a product with quantity = 3
3. Add to cart
4. Go to cart page
5. Try to increase quantity to 4
6. **Expected**: Cannot exceed 3, shows "Maximum available stock" message

### Test Case 5: Out of Stock Product

1. As customer, try to add a product with quantity = 0 to cart
2. **Expected**: "Add to Cart" button is disabled, shows "Out of Stock"

### Test Case 6: Stock Decrease After Checkout

1. Create a product with quantity = 10
2. As customer, add 3 of this product to cart
3. Complete checkout successfully
4. **Expected**: Product quantity decreases to 7

### Test Case 7: Concurrent Purchase Validation

1. Set product quantity to 1
2. Two users try to add it to cart simultaneously
3. Both try to checkout
4. **Expected**: Only one succeeds, the other gets "Out of stock" error

### Test Case 8: Arabic Localization

1. Switch to Arabic locale
2. View products page as restaurant owner
3. **Expected**: "Stock", "Out of Stock", "Quantity" all in Arabic
4. View store as customer
5. **Expected**: Stock messages in Arabic

---

## Migration Considerations

> [!CAUTION] > **Existing Products - DECISION CONFIRMED**
>
> All existing menu items will have `quantity` field default to **1**.
>
> **Approach**: Rely on schema default (quantity: 1) for new and existing products
>
> - The schema will automatically set quantity = 1 for any product without this field
> - Restaurant owners can manually update quantities as needed through the dashboard

### Optional Migration Script

If you want to explicitly set quantity for all existing products:

```javascript
// scripts/add-quantity-to-menu-items.js
db.restaurants.updateMany(
  { "menus.quantity": { $exists: false } },
  { $set: { "menus.$[].quantity": 1 } }
);
```

---

## Summary

This implementation adds comprehensive inventory management:

1. **Backend**: Add `quantity` and computed `inStock` fields to menu items
2. **Restaurant Dashboard**: Allow owners to set/edit quantity
3. **Cart**: Enforce stock limits when adding items and changing quantities
4. **Checkout**: Decrease stock after successful payment
5. **UI**: Display stock status, out-of-stock badges, and stock limits
6. **Localization**: Full support for English and Arabic

The system prevents overselling through atomic stock updates and cart validation while providing clear feedback to both restaurant owners and customers about stock availability.
