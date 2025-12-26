# Product Inventory Management - Testing Walkthrough

This document provides step-by-step testing instructions for the complete product inventory management system.

## Prerequisites

- Application running locally
- Database seeded with at least one restaurant account
- Test user account (customer) created
- Stripe test mode configured

---

## Phase 1: Restaurant Dashboard - Stock Management

### Test 1.1: Add New Product with Quantity

**Goal**: Verify restaurant owners can add products with stock quantity

**Steps**:

1. Log in as a restaurant owner
2. Navigate to `/[locale]/restaurant/products`
3. Click "Add Product" button
4. Fill in the form:
   - **Title**: "Fresh Organic Apples"
   - **Subtitle**: "Locally sourced, pesticide-free"
   - **Price**: 5.99
   - **Category**: Select "Fruits"
   - **Quantity**: Enter `15`
   - Upload an image (optional)
5. Click "Save"

**Expected Results**:

- ✅ Product appears in the grid
- ✅ Product card displays "Stock: 15"
- ✅ No "Out of Stock" badge visible
- ✅ Category badge shows "Fruits" in bottom-left corner

**Screenshot Location**: Save as `test_1.1_add_product.png`

---

### Test 1.2: Add Product with Default Quantity

**Goal**: Verify default quantity is 1 when not specified

**Steps**:

1. Click "Add Product" again
2. Fill in basic info but **leave quantity field empty**:
   - **Title**: "Artisan Bread"
   - **Subtitle**: "Freshly baked daily"
   - **Price**: 3.50
   - **Category**: "Bakery"
3. Click "Save"

**Expected Results**:

- ✅ Product card shows "Stock: 1"
- ✅ Product is visible and available

---

### Test 1.3: Create Out-of-Stock Product

**Goal**: Test out-of-stock indicator

**Steps**:

1. Add a new product with **Quantity: 0**:
   - **Title**: "Sold Out Tomatoes"
   - **Price**: 2.99
   - **Category**: "Vegetables"
   - **Quantity**: `0`
2. Save the product

**Expected Results**:

- ✅ Product card displays "Stock: 0"
- ✅ Red "Out of Stock" badge appears on the card
- ✅ Product is still visible in the dashboard

**Screenshot**: `test_1.3_out_of_stock.png`

---

### Test 1.4: Edit Product Quantity

**Goal**: Verify quantity can be updated

**Steps**:

1. Find "Fresh Organic Apples" (from Test 1.1)
2. Click the "Edit" button
3. Change **Quantity** from 15 to **5**
4. Click "Save"

**Expected Results**:

- ✅ Product card now shows "Stock: 5"
- ✅ Other product details remain unchanged

---

### Test 1.5: Update Out-of-Stock Product

**Goal**: Verify out-of-stock badge disappears when stock is added

**Steps**:

1. Edit "Sold Out Tomatoes"
2. Change **Quantity** from 0 to **10**
3. Save

**Expected Results**:

- ✅ "Out of Stock" badge disappears
- ✅ Product card shows "Stock: 10"

---

### Test 1.6: Localization Check (Arabic)

**Goal**: Verify translations work correctly

**Steps**:

1. Switch language to Arabic (العربية)
2. View the products page

**Expected Results**:

- ✅ "Stock" label appears as "المخزون"
- ✅ "Out of Stock" appears as "نفذت الكمية"
- ✅ "Quantity" label in popup appears as "الكمية"

---

## Phase 2: Customer Experience & Cart Validation

### Test 2.1: View Products as Customer

**Goal**: Verify customers see stock status

**Steps**:

1. Log out from restaurant account
2. Log in as a customer
3. Navigate to store/restaurant page
4. Click on "Fresh Organic Apples" product

**Expected Results**:

- ✅ Product details page loads
- ✅ Product is available (not disabled)
- ✅ "Add to Cart" button is enabled

---

### Test 2.2: Add Product to Cart

**Goal**: Test adding in-stock product to cart

**Steps**:

1. On "Fresh Organic Apples" details page (Stock: 5)
2. Click "Add to Cart"
3. Navigate to cart page (`/cart`)

**Expected Results**:

- ✅ Success toast: "Added to cart"
- ✅ Product appears in cart with quantity = 1
- ✅ Cart icon shows item count

---

### Test 2.3: Test Max Quantity Limit (UI)

**Goal**: Verify cart prevents exceeding available stock

**Steps**:

1. In cart, find "Fresh Organic Apples" (maxQuantity: 5)
2. Try to manually change quantity to **6** using the number input
3. Press Enter or click elsewhere

**Expected Results**:

- ✅ Quantity stays at 5 (or is automatically capped)
- ✅ Console warning: "Cannot update: exceeds available stock" (check browser console)

**Alternative Test** (if quantity selector has +/- buttons):

- Click "+" button when quantity is already at max (5)
- ✅ Quantity does not increase beyond 5

---

### Test 2.4: Add Multiple Items to Cart

**Goal**: Test cart with multiple different products

**Steps**:

1. Go back to store/restaurant page
2. Add "Artisan Bread" (Stock: 1) to cart
3. View cart

**Expected Results**:

- ✅ Cart now has 2 different products
- ✅ "Fresh Organic Apples" still shows correct quantity
- ✅ "Artisan Bread" shows quantity = 1

---

### Test 2.5: Try to Exceed Stock via Repeated Adds

**Goal**: Verify adding same product multiple times respects stock

**Steps**:

1. Current cart: "Artisan Bread" x1 (maxQuantity: 1)
2. Go to store and try to add "Artisan Bread" again
3. Click "Add to Cart" button

**Expected Results**:

- ✅ Cart quantity does NOT exceed maxQuantity (1)
- ✅ Console shows: "Cannot add more: exceeds available stock"
- ✅ Toast notification may appear (if implemented)

---

### Test 2.6: View Out-of-Stock Product

**Goal**: Verify customers cannot add out-of-stock items

**Steps**:

1. Create a product with quantity = 0 as restaurant owner
2. Log in as customer
3. Navigate to that product's details page

**Expected Results**:

- ✅ "Add to Cart" button is **disabled**
- ✅ Button text shows "Out of Stock" or "نفذت الكمية" (Arabic)
- ✅ Clicking button does nothing

**Screenshot**: `test_2.6_out_of_stock_customer.png`

---

## Phase 3: Payment & Stock Decrease

### Test 3.1: Checkout and Verify Payment Intent

**Goal**: Test payment flow initiates correctly

**Steps**:

1. Ensure cart has items (e.g., "Fresh Organic Apples" x2)
2. Click "Proceed to Checkout"
3. Enter shipping/billing details (test data)
4. Use Stripe test card: **4242 4242 4242 4242**
   - Expiry: Any future date
   - CVC: Any 3 digits
5. Click "Pay"

**Expected Results**:

- ✅ Payment processes successfully
- ✅ Redirect to success/confirmation page
- ✅ Cart is cleared
- ✅ Order confirmation displayed

---

### Test 3.2: Verify Stock Decreased in Database

**Goal**: Confirm stock was reduced after successful payment

**Steps**:

1. After successful payment (Test 3.1)
2. Log in as restaurant owner
3. Navigate to `/[locale]/restaurant/products`
4. Find "Fresh Organic Apples"

**Expected Results**:

- ✅ Stock decreased by purchased amount (was 5, purchased 2, now shows **3**)
- ✅ Product is still visible
- ✅ If stock reaches 0, "Out of Stock" badge appears

**Verification via Console** (optional):

```bash
# Check server logs for:
✅ Payment succeeded: <payment_intent_id>
✅ Stock decreased: Product <product_id>, Quantity 2
✅ Order created and stock decreased successfully
```

---

### Test 3.3: Purchase Entire Stock

**Goal**: Verify product goes out of stock when all units are purchased

**Steps**:

1. As customer, add "Artisan Bread" (Stock: 1) to cart
2. Complete checkout and payment
3. Log in as restaurant owner
4. Check "Artisan Bread" in products dashboard

**Expected Results**:

- ✅ Stock now shows "Stock: 0"
- ✅ "Out of Stock" badge appears
- ✅ Customers can no longer add to cart

---

### Test 3.4: Concurrent Purchase Scenario (Advanced)

**Goal**: Test race condition handling

**Prerequisites**:

- Product "Test Item" with Stock: 1
- Two browser windows/devices

**Steps**:

1. **Browser A**: Customer 1 adds "Test Item" to cart
2. **Browser B**: Customer 2 adds same "Test Item" to cart
3. **Browser A**: Complete checkout first
4. **Browser B**: Try to complete checkout

**Expected Results**:

- ✅ Browser A's payment succeeds, stock decreases to 0
- ✅ Browser B's checkout either:
  - Fails with "Out of stock" error (best case)
  - OR payment succeeds but stock decrease fails gracefully (logged)
- ✅ Server logs show atomic update attempt
- ✅ No negative stock values

**Note**: This test requires manual coordination or automated testing scripts.

---

### Test 3.5: Failed Payment (Stock Not Decreased)

**Goal**: Verify stock is NOT decreased when payment fails

**Steps**:

1. Add product to cart (e.g., "Fresh Organic Apples", current stock: 3)
2. Start checkout
3. Use **declining test card**: `4000 0000 0000 0002`
4. Submit payment

**Expected Results**:

- ✅ Payment fails
- ✅ Error message displayed
- ✅ Check restaurant dashboard: **stock is still 3** (unchanged)
- ✅ Server logs show payment failure, no stock decrease

---

## Summary Checklist

### Phase 1: Restaurant Dashboard ✅

- [x] Add product with custom quantity
- [x] Add product with default quantity (1)
- [x] Create out-of-stock product (quantity = 0)
- [x] Edit product quantity
- [x] Out-of-stock badge appears/disappears correctly
- [x] Localization works (Arabic)

### Phase 2: Cart & Customer UI ✅

- [x] View products as customer
- [x] Add product to cart
- [x] Cart enforces max quantity limit
- [x] Multiple products in cart work correctly
- [x] Cannot exceed stock via repeated adds
- [x] Out-of-stock products cannot be added to cart

### Phase 3: Payment & Stock Decrease ✅

- [x] Successful payment processes
- [x] Stock decreases after payment
- [x] Product goes out-of-stock when depleted
- [x] Concurrent purchases handled gracefully
- [x] Failed payments do NOT decrease stock

---

## Browser Console Debugging

During testing, monitor the browser console (F12) for these logs:

**Expected Logs**:

- `✅ Stock decreased: Product <id>, Quantity <qty>` (server)
- `Cannot add more: exceeds available stock` (client, CartSlice)
- `Cannot update: exceeds available stock` (client, CartSlice)

**Error Logs to Investigate**:

- `❌ Failed to decrease stock for product <id>` (server)
- `❌ Missing metadata in payment intent` (server)

---

## Troubleshooting

### Issue: Stock Not Decreasing After Payment

**Check**:

1. Stripe webhook configured correctly
2. Environment variable `STRIPE_WEBHOOK_SECRET` is set
3. Server logs show payment success event
4. `decreaseStockForOrder` method is called

### Issue: Can Add More Than Max Quantity

**Check**:

1. Product has `maxQuantity` set when adding to cart
2. CartSlice validation is active
3. Browser console shows validation logs

### Issue: Out-of-Stock Badge Not Showing

**Check**:

1. Product `quantity` === 0
2. `inStock` virtual field is working
3. Component is using `product.inStock` correctly
4. Translations exist (`en.json`, `ar.json`)

---

## Notes

- All tests should be performed in both **English** and **Arabic** locales
- Screenshots should be saved for documentation
- Failed tests should be logged with error messages
- Performance can be tested with 100+ products

**Testing Complete! 🎉**
