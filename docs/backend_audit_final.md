# Backend Audit: Missing Methods for AI Chatbot - FINAL

> **Status:** Post-Master Pull - Ready for Implementation  
> **Date:** 2025-12-23  
> **Total Missing Methods:** 25 (21 original + 4 for new categories feature)

---

## Executive Summary

After auditing all backend repositories following the master pull, the backend is **80% ready** but needs additional aggregation/analytics methods to avoid token overflow and enable the full chatbot feature set.

**Major Discovery:** Categories feature was added to both restaurants and products, requiring new filtering methods.

---

## 🆕 NEW: Categories Feature From Master

### Restaurant Categories

```typescript
export type ShopCategory =
  | "Supermarket"
  | "Hypermarket"
  | "Grocery"
  | "Bakery"
  | "Cafe"
  | "Other";
```

### Product/Menu Item Categories

```typescript
export type MenuItemCategory =
  | "Fruits"
  | "Vegetables"
  | "Meat"
  | "Dairy"
  | "Bakery"
  | "Snacks"
  | "Other";
```

**Impact:** Users can now ask "show me fruits" or "find bakeries" - requires new filtering methods.

---

## ✅ What's Already Good

### Product Repository

- ✅ Pagination with limit (prevents loading entire collection)
- ✅ Sorting by price, title, rating
- ✅ Search functionality
- ✅ Already has filtering options

### Order Repository

- ✅ `bestSellingProducts()` - Top 10 products by sales
- ✅ `topCustomers()` - Top 10 customers by spending
- ✅ `dailySales()` - Sales grouped by date
- ✅ `revenuePerRestaurant()` - Revenue per restaurant
- ✅ Good aggregation already exists

### Restaurant Repository

- ✅ Pagination
- ✅ Sorting by rating (high/low)
- ✅ Already excludes hidden restaurants

### User Repository

- ✅ `getUsersByRoleAdvanced()` - Get users by role with limits
- ✅ Sorting functionality

### Event Repository

- ✅ `getEvents()` - Gets all upcoming events with user info
- ✅ `getEventsByUserId()` - User-specific events

---

## ❌ What's Missing - Complete List

### 1. Product Repository - Missing Methods

#### 🔴 CRITICAL - Category Support (NEW!)

**File:** `src/backend/features/product/product.repository.ts`

```typescript
// GET PRODUCTS BY CATEGORY
async getProductsByCategory(
  category: MenuItemCategory,
  limit: number = 20
): Promise<ProductResponse[]> {
  await DBInstance.getConnection();

  const pipeline: PipelineStage[] = [
    { $unwind: "$menus" },
    { $match: { "menus.category": category } },
    {
      $addFields: {
        avgRating: {
          $cond: [
            { $gt: [{ $size: { $ifNull: ["$menus.itemRating", []] } }, 0] },
            { $avg: "$menus.itemRating.rate" },
            0,
          ],
        },
      },
    },
    { $sort: { avgRating: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: "$menus._id",
        restaurantId: "$_id",
        restaurantName: "$name",
        title: "$menus.title",
        subtitle: "$menus.subtitle",
        price: "$menus.price",
        category: "$menus.category",
        avgRating: 1,
        sustainabilityScore: "$menus.sustainabilityScore",
      },
    },
  ];

  return await RestaurantModel.aggregate(pipeline).exec();
}

// GET PRODUCT CATEGORY COUNTS
async getProductCategoryCounts(): Promise<{ category: string; count: number }[]> {
  await DBInstance.getConnection();

  const result = await RestaurantModel.aggregate([
    { $unwind: "$menus" },
    {
      $group: {
        _id: "$menus.category",
        count: { $count: {} },
      },
    },
    {
      $project: {
        category: "$_id",
        count: 1,
        _id: 0,
      },
    },
    { $sort: { count: -1 } },
  ]).exec();

  return result;
}
```

**Interface Update:**

```typescript
export interface IProductRepository {
  // ... existing methods
  getProductsByCategory(
    category: MenuItemCategory,
    limit?: number
  ): Promise<ProductResponse[]>;
  getProductCategoryCounts(): Promise<{ category: string; count: number }[]>;
}
```

**Why Needed:**

- Chatbot: "Show me fruits" or "What dairy products do you have?"
- Chatbot: "How many vegetable products are there?"

---

#### 🔴 CRITICAL - Analytics Methods

```typescript
// TOP PRODUCTS BY RATING
async getTopProductsByRating(limit: number = 10): Promise<ProductResponse[]> {
  await DBInstance.getConnection();

  const pipeline: PipelineStage[] = [
    { $unwind: "$menus" },
    {
      $addFields: {
        avgRating: {
          $cond: [
            { $gt: [{ $size: { $ifNull: ["$menus.itemRating", []] } }, 0] },
            { $avg: "$menus.itemRating.rate" },
            0,
          ],
        },
      },
    },
    { $match: { avgRating: { $gt: 0 } } },
    { $sort: { avgRating: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: "$menus._id",
        restaurantId: "$_id",
        restaurantName: "$name",
        title: "$menus.title",
        subtitle: "$menus.subtitle",
        price: "$menus.price",
        avgRating: 1,
        sustainabilityScore: "$menus.sustainabilityScore",
      },
    },
  ];

  return await RestaurantModel.aggregate(pipeline).exec();
}

// CHEAPEST PRODUCTS
async getCheapestProducts(limit: number = 10): Promise<ProductResponse[]> {
  await DBInstance.getConnection();

  const pipeline: PipelineStage[] = [
    { $unwind: "$menus" },
    { $sort: { "menus.price": 1 } },
    { $limit: limit },
    {
      $project: {
        _id: "$menus._id",
        restaurantId: "$_id",
        restaurantName: "$name",
        title: "$menus.title",
        subtitle: "$menus.subtitle",
        price: "$menus.price",
        category: "$menus.category",
      },
    },
  ];

  return await RestaurantModel.aggregate(pipeline).exec();
}

// MOST SUSTAINABLE PRODUCTS
async getMostSustainableProducts(limit: number = 10): Promise<ProductResponse[]> {
  await DBInstance.getConnection();

  const pipeline: PipelineStage[] = [
    { $unwind: "$menus" },
    {
      $match: {
        "menus.sustainabilityScore": { $exists: true, $ne: null, $gt: 0 }
      }
    },
    { $sort: { "menus.sustainabilityScore": -1 } },
    { $limit: limit },
    {
      $project: {
        _id: "$menus._id",
        restaurantId: "$_id",
        restaurantName: "$name",
        title: "$menus.title",
        sustainabilityScore: "$menus.sustainabilityScore",
        sustainabilityReason: "$menus.sustainabilityReason",
        price: "$menus.price",
      },
    },
  ];

  return await RestaurantModel.aggregate(pipeline).exec();
}

// TOTAL PRODUCT COUNT
async getTotalProductCount(): Promise<number> {
  await DBInstance.getConnection();

  const result = await RestaurantModel.aggregate([
    { $unwind: "$menus" },
    { $count: "total" },
  ]).exec();

  return result[0]?.total || 0;
}
```

**Interface Update:**

```typescript
export interface IProductRepository {
  // ... existing methods
  getTopProductsByRating(limit?: number): Promise<ProductResponse[]>;
  getCheapestProducts(limit?: number): Promise<ProductResponse[]>;
  getMostSustainableProducts(limit?: number): Promise<ProductResponse[]>;
  getTotalProductCount(): Promise<number>;
}
```

**Why Needed:**

- "Show me top-rated products"
- "What are the cheapest items?"
- "Most eco-friendly products"
- "How many products are there?"

---

### 2. Restaurant Repository - Missing Methods

#### 🔴 CRITICAL - Category Support (NEW!)

**File:** `src/backend/features/restaurant/restaurant.repository.ts`

```typescript
// GET RESTAURANTS BY CATEGORY
async getRestaurantsByCategory(
  category: ShopCategory,
  limit: number = 10
): Promise<IRestaurant[]> {
  await DBInstance.getConnection();

  return await RestaurantModel.find({
    category,
    isHidden: false
  })
    .limit(limit)
    .select("name location category description restaurantRating")
    .lean<IRestaurant[]>()
    .exec();
}

// GET RESTAURANT CATEGORY COUNTS
async getRestaurantCategoryCounts(): Promise<{ category: string; count: number }[]> {
  await DBInstance.getConnection();

  const result = await RestaurantModel.aggregate([
    { $match: { isHidden: false } },
    {
      $group: {
        _id: "$category",
        count: { $count: {} },
      },
    },
    {
      $project: {
        category: "$_id",
        count: 1,
        _id: 0,
      },
    },
    { $sort: { count: -1 } },
  ]).exec();

  return result;
}
```

**Interface Update:**

```typescript
export interface IRestaurantRepository {
  // ... existing methods
  getRestaurantsByCategory(
    category: ShopCategory,
    limit?: number
  ): Promise<IRestaurant[]>;
  getRestaurantCategoryCounts(): Promise<{ category: string; count: number }[]>;
}
```

**Why Needed:**

- "Show me bakeries"
- "Find supermarkets near me"
- "How many cafes are there?"

---

#### 🔴 CRITICAL - Analytics Methods

```typescript
// TOP RESTAURANTS BY RATING
async getTopRestaurantsByRating(limit: number = 10): Promise<IRestaurant[]> {
  await DBInstance.getConnection();

  const pipeline = [
    { $match: { isHidden: false } },
    {
      $addFields: {
        avgRating: {
          $cond: [
            { $gt: [{ $size: { $ifNull: ["$restaurantRating", []] } }, 0] },
            { $avg: "$restaurantRating.rate" },
            0,
          ],
        },
      },
    },
    { $match: { avgRating: { $gt: 0 } } },
    { $sort: { avgRating: -1 } },
    { $limit: limit },
  ];

  return await RestaurantModel.aggregate(pipeline).exec();
}

// RESTAURANTS WITH MOST PRODUCTS
async getRestaurantsWithMostProducts(limit: number = 10): Promise<any[]> {
  await DBInstance.getConnection();

  const pipeline = [
    { $match: { isHidden: false } },
    {
      $addFields: {
        productCount: { $size: { $ifNull: ["$menus", []] } },
      },
    },
    { $sort: { productCount: -1 } },
    { $limit: limit },
    {
      $project: {
        name: 1,
        productCount: 1,
        location: 1,
        category: 1,
      },
    },
  ];

  return await RestaurantModel.aggregate(pipeline).exec();
}

// TOTAL RESTAURANT COUNT
async getTotalRestaurantCount(): Promise<number> {
  await DBInstance.getConnection();

  return await RestaurantModel.countDocuments({ isHidden: false }).exec();
}
```

**Interface Update:**

```typescript
export interface IRestaurantRepository {
  // ... existing methods
  getTopRestaurantsByRating(limit?: number): Promise<IRestaurant[]>;
  getRestaurantsWithMostProducts(limit?: number): Promise<any[]>;
  getTotalRestaurantCount(): Promise<number>;
}
```

**Why Needed:**

- "Top restaurants"
- "Restaurants with most variety"
- "How many restaurants are there?"

---

### 3. Recycle Repository - Missing Methods

**File:** `src/backend/features/recycle/recycle.repository.ts`

```typescript
// TOTAL CARBON SAVED
async getTotalCarbonSaved(): Promise<number> {
  const result = await RecycleModel.aggregate([
    {
      $group: {
        _id: null,
        totalCarbon: { $sum: "$totalCarbonSaved" },
      },
    },
  ]).exec();

  return result[0]?.totalCarbon || 0;
}

// RECYCLING STATISTICS
async getRecyclingStatistics(): Promise<{
  totalEntries: number;
  totalCarbonSaved: number;
  totalWeight: number;
}> {
  const result = await RecycleModel.aggregate([
    {
      $group: {
        _id: null,
        totalEntries: { $count: {} },
        totalCarbonSaved: { $sum: "$totalCarbonSaved" },
        totalWeight: {
          $sum: {
            $reduce: {
              input: "$recycleItems",
              initialValue: 0,
              in: { $add: ["$$value", "$$this.weight"] },
            },
          },
        },
      },
    },
  ]).exec();

  return result[0] || {
    totalEntries: 0,
    totalCarbonSaved: 0,
    totalWeight: 0,
  };
}

// PENDING RECYCLING REQUESTS
async getPendingRecyclingRequests(limit: number = 20): Promise<IRecycle[]> {
  return await RecycleModel.find({ isVerified: false })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean<IRecycle[]>()
    .exec();
}

// RECENT RECYCLING ENTRIES
async getRecentRecyclingEntries(limit: number = 10): Promise<IRecycle[]> {
  return await RecycleModel.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("firstName lastName totalCarbonSaved createdAt")
    .lean<IRecycle[]>()
    .exec();
}
```

**Interface Update:**

```typescript
export interface IRecycleRepository {
  // ... existing methods
  getTotalCarbonSaved(): Promise<number>;
  getRecyclingStatistics(): Promise<{
    totalEntries: number;
    totalCarbonSaved: number;
    totalWeight: number;
  }>;
  getPendingRecyclingRequests(limit?: number): Promise<IRecycle[]>;
  getRecentRecyclingEntries(limit?: number): Promise<IRecycle[]>;
}
```

**Why Needed:**

- RecycleMan: "Show pending requests"
- Admin: "Total carbon saved"
- "Recent recycling entries"

---

### 4. Order Repository - Missing Methods

**File:** `src/backend/features/orders/order.repository.ts`

```typescript
// RECENT ORDERS
async getRecentOrders(limit: number = 10): Promise<IOrder[]> {
  await DBInstance.getConnection();

  return await OrderModel.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'firstName lastName email')
    .lean<IOrder[]>()
    .exec();
}

// ORDERS BY STATUS
async getOrdersByStatus(
  status: "pending" | "completed" | "cancelled",
  limit: number = 20
): Promise<IOrder[]> {
  await DBInstance.getConnection();

  return await OrderModel.find({ status })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean<IOrder[]>()
    .exec();
}

// TOTAL REVENUE
async getTotalRevenue(): Promise<number> {
  await DBInstance.getConnection();

  const result = await OrderModel.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$orderPrice" },
      },
    },
  ]).exec();

  return result[0]?.totalRevenue || 0;
}
```

**Interface Update:**

```typescript
export interface IOrderRepository {
  // ... existing methods
  getRecentOrders(limit?: number): Promise<IOrder[]>;
  getOrdersByStatus(
    status: "pending" | "completed" | "cancelled",
    limit?: number
  ): Promise<IOrder[]>;
  getTotalRevenue(): Promise<number>;
}
```

**Why Needed:**

- "Show recent orders"
- "Pending orders"
- "What's our total revenue?"

---

### 5. Event Repository - Missing Methods

**File:** `src/backend/features/event/event.repository.ts`

```typescript
// UPCOMING EVENTS WITH LIMIT
async getUpcomingEvents(limit: number = 10): Promise<IEvent[]> {
  await DBInstance.getConnection();

  const events = await UserModel.aggregate([
    { $unwind: "$events" },
    {
      $match: {
        "events.eventDate": { $gte: new Date() },
        "events.isAccepted": true,
      },
    },
    { $sort: { "events.eventDate": 1 } },
    { $limit: limit },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            "$events",
            {
              organizer: {
                _id: "$_id",
                firstName: "$firstName",
                email: "$email",
              },
            },
          ],
        },
      },
    },
  ]).exec();

  return events;
}

// TOTAL EVENTS COUNT
async getTotalEventsCount(): Promise<number> {
  await DBInstance.getConnection();

  const result = await UserModel.aggregate([
    { $unwind: "$events" },
    { $count: "total" },
  ]).exec();

  return result[0]?.total || 0;
}

// EVENT STATISTICS
async getEventStatistics(): Promise<{
  totalEvents: number;
  upcomingEvents: number;
  totalAttendees: number;
}> {
  await DBInstance.getConnection();

  const result = await UserModel.aggregate([
    { $unwind: "$events" },
    {
      $group: {
        _id: null,
        totalEvents: { $count: {} },
        upcomingEvents: {
          $sum: {
            $cond: [
              { $gte: ["$events.eventDate", new Date()] },
              1,
              0,
            ],
          },
        },
        totalAttendees: {
          $sum: { $size: { $ifNull: ["$events.attenders", []] } },
        },
      },
    },
  ]).exec();

  return result[0] || {
    totalEvents: 0,
    upcomingEvents: 0,
    totalAttendees: 0,
  };
}

// EVENTS BY ORGANIZER (LIMITED)
async getEventsByOrganizerLimited(
  userId: string,
  limit: number = 10
): Promise<IEvent[]> {
  await DBInstance.getConnection();

  const user = await UserModel.findById(userId, { events: 1 })
    .lean<{ events: IEvent[] }>()
    .exec();

  if (!user?.events) return [];

  return user.events
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
    .slice(0, limit);
}
```

**Interface Update:**

```typescript
export interface IEventRepository {
  // ... existing methods
  getUpcomingEvents(limit?: number): Promise<IEvent[]>;
  getTotalEventsCount(): Promise<number>;
  getEventStatistics(): Promise<{
    totalEvents: number;
    upcomingEvents: number;
    totalAttendees: number;
  }>;
  getEventsByOrganizerLimited(
    userId: string,
    limit?: number
  ): Promise<IEvent[]>;
}
```

**Why Needed:**

- "Show upcoming events"
- "How many events?"
- Organizer: "My recent events"

---

### 6. User Repository - Missing Methods

**File:** `src/backend/features/user/user.repository.ts`

```typescript
// TOTAL USERS COUNT BY ROLE
async getUserCountByRole(role?: UserRole): Promise<number> {
  await DBInstance.getConnection();

  if (role) {
    return await UserModel.countDocuments({ role }).exec();
  }
  return await UserModel.countDocuments().exec();
}

// USER GROWTH
async getRecentUserCount(days: number = 30): Promise<number> {
  await DBInstance.getConnection();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await UserModel.countDocuments({
    createdAt: { $gte: startDate },
  }).exec();
}

// TOP USERS BY POINTS
async getTopUsersByPoints(limit: number = 10): Promise<IUser[]> {
  await DBInstance.getConnection();

  return await UserModel.find({ role: "customer" })
    .sort({ points: -1 })
    .limit(limit)
    .select("firstName lastName points email")
    .lean<IUser[]>()
    .exec();
}
```

**Interface Update:**

```typescript
export interface IUserRepository {
  // ... existing methods
  getUserCountByRole(role?: UserRole): Promise<number>;
  getRecentUserCount(days?: number): Promise<number>;
  getTopUsersByPoints(limit?: number): Promise<IUser[]>;
}
```

**Why Needed:**

- "How many customers?"
- "User growth this month"
- "Top point earners"

---

## 🎯 Implementation Priority

### Phase 1: Categories Support (NEW - HIGHEST PRIORITY)

**Time:** 1 hour  
**Methods:** 4

1. ✅ `ProductRepository.getProductsByCategory()`
2. ✅ `ProductRepository.getProductCategoryCounts()`
3. ✅ `RestaurantRepository.getRestaurantsByCategory()`
4. ✅ `RestaurantRepository.getRestaurantCategoryCounts()`

**Why First:** Categories are a major new feature. Essential for chatbot.

### Phase 2: Core Analytics (CRITICAL)

**Time:** 1.5 hours  
**Methods:** 11

5. `ProductRepository.getTopProductsByRating()`
6. `ProductRepository.getCheapestProducts()`
7. `ProductRepository.getTotalProductCount()`
8. `ProductRepository.getMostSustainableProducts()`
9. `RestaurantRepository.getTopRestaurantsByRating()`
10. `RestaurantRepository.getTotalRestaurantCount()`
11. `RecycleRepository.getTotalCarbonSaved()`
12. `RecycleRepository.getPendingRecyclingRequests()`
13. `OrderRepository.getRecentOrders()`
14. `OrderRepository.getTotalRevenue()`
15. `EventRepository.getUpcomingEvents()`

### Phase 3: Additional Analytics (MEDIUM)

**Time:** 1 hour  
**Methods:** 10

16. `RestaurantRepository.getRestaurantsWithMostProducts()`
17. `RecycleRepository.getRecyclingStatistics()`
18. `RecycleRepository.getRecentRecyclingEntries()`
19. `OrderRepository.getOrdersByStatus()`
20. `EventRepository.getTotalEventsCount()`
21. `EventRepository.getEventStatistics()`
22. `EventRepository.getEventsByOrganizerLimited()`
23. `UserRepository.getUserCountByRole()`
24. `UserRepository.getRecentUserCount()`
25. `UserRepository.getTopUsersByPoints()`

---

## 📊 Impact Assessment

### Without These Methods:

- ❌ Chatbot would load entire collections → **token overflow**
- ❌ Slow queries (sorting/filtering in memory)
- ❌ Can't answer: "top products," "how many X," "show recent Y"
- ❌ Can't use new categories feature
- ❌ Poor performance with scale

### With These Methods:

- ✅ Efficient database-level aggregation
- ✅ Limited results (10-20 items max)
- ✅ Fast queries
- ✅ Token-efficient (only necessary data)
- ✅ Can answer all common chatbot queries
- ✅ Full category filtering support

---

## 📋 Summary Table

| Repository     | Current Status | Missing Methods | Category Methods | Analytics Methods | Priority  |
| -------------- | -------------- | --------------- | ---------------- | ----------------- | --------- |
| **Product**    | 75%            | 6               | 2                | 4                 | 🔴 High   |
| **Restaurant** | 80%            | 5               | 2                | 3                 | 🔴 High   |
| **Recycle**    | 50%            | 4               | 0                | 4                 | 🔴 High   |
| **Order**      | 90%            | 3               | 0                | 3                 | 🟡 Medium |
| **Event**      | 70%            | 4               | 0                | 4                 | 🟡 Medium |
| **User**       | 85%            | 3               | 0                | 3                 | 🟢 Low    |

**Total Missing:** 25 methods  
**Critical (Phase 1 + 2):** 15 methods  
**Time to Implement:** ~3.5 hours

---

## 💡 Recommendation

**Add these methods before implementing the chatbot.** They take ~3.5 hours but will prevent:

1. ❌ Token limits when sending entire collections to AI
2. ❌ Slow chatbot responses
3. ❌ Inability to answer common questions
4. ❌ Inability to use the new categories feature

**Estimate:** 25 methods × 8 minutes average = **3.5 hours**

This investment will enable a production-ready, efficient chatbot that can handle all user queries effectively.
