# Backend Audit: Missing Methods for AI Chatbot

## Executive Summary

After auditing all backend repositories, I've identified **missing methods** that would be needed for efficient chatbot queries. The current backend is **80% ready** but needs additional aggregation/analytics methods to avoid token overflow and improve performance.

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

## ❌ What's Missing (Critical for Chatbot)

### 1. Product Repository - Missing Analytics Methods

**Problem:** Can only get paginated products. No methods for "top products," "cheapest products," etc.

**Missing Methods:**

```typescript
// TOP PRODUCTS BY RATING (for chatbot "show me top products")
async getTopProductsByRating(limit: number = 10): Promise<ProductResponse[]> {
  const pipeline = [
    { $unwind: "$menus" },
    {
      $addFields: {
        avgRating: {
          $cond: [
            { $gt: [{ $size: "$menus.itemRating" }, 0] },
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
        title: "$menus.title",
        price: "$menus.price",
        restaurantName: "$name",
        avgRating: 1,
      },
    },
  ];
  return await RestaurantModel.aggregate(pipeline).exec();
}

// CHEAPEST PRODUCTS (for chatbot "what are the cheapest products?")
async getCheapestProducts(limit: number = 10): Promise<ProductResponse[]> {
  const pipeline = [
    { $unwind: "$menus" },
    { $sort: { "menus.price": 1 } },
    { $limit: limit },
    {
      $project: {
        _id: "$menus._id",
        title: "$menus.title",
        price: "$menus.price",
        restaurantName: "$name",
      },
    },
  ];
  return await RestaurantModel.aggregate(pipeline).exec();
}

// PRODUCTS BY SUSTAINABILITY SCORE (for "most eco-friendly products")
async getMostSustainableProducts(limit: number = 10): Promise<ProductResponse[]> {
  const pipeline = [
    { $unwind: "$menus" },
    { $match: { "menus.sustainabilityScore": { $exists: true, $ne: null } } },
    { $sort: { "menus.sustainabilityScore": -1 } },
    { $limit: limit },
    {
      $project: {
        _id: "$menus._id",
        title: "$menus.title",
        sustainabilityScore: "$menus.sustainabilityScore",
        sustainabilityReason: "$menus.sustainabilityReason",
      },
    },
  ];
  return await RestaurantModel.aggregate(pipeline).exec();
}

// TOTAL PRODUCT COUNT (for "how many products are there?")
async getTotalProductCount(): Promise<number> {
  const result = await RestaurantModel.aggregate([
    { $unwind: "$menus" },
    { $count: "total" },
  ]).exec();
  return result[0]?.total || 0;
}
```

**Why Needed:** Chatbot queries like "show me top-rated products" or "cheapest items" would currently require loading ALL products and sorting in-memory. These methods do it efficiently at database level.

---

### 2. Restaurant Repository - Missing Analytics Methods

**Problem:** Can get restaurants with pagination, but no methods for stats/top restaurants.

**Missing Methods:**

```typescript
// TOP RESTAURANTS BY RATING
async getTopRestaurantsByRating(limit: number = 10): Promise<IRestaurant[]> {
  const pipeline = [
    { $match: { isHidden: false } },
    {
      $addFields: {
        avgRating: {
          $cond: [
            { $gt: [{ $size: "$restaurantRating" }, 0] },
            { $avg: "$restaurantRating.rate" },
            0,
          ],
        },
      },
    },
    { $sort: { avgRating: -1 } },
    { $limit: limit },
  ];
  return await RestaurantModel.aggregate(pipeline).exec();
}

// RESTAURANTS WITH MOST PRODUCTS
async getRestaurantsWithMostProducts(limit: number = 10): Promise<any[]> {
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
      },
    },
  ];
  return await RestaurantModel.aggregate(pipeline).exec();
}

// TOTAL RESTAURANT COUNT
async getTotalRestaurantCount(): Promise<number> {
  return await RestaurantModel.countDocuments({ isHidden: false }).exec();
}
```

**Why Needed:** Queries like "top restaurants" or "how many restaurants are there?" need efficient counting/sorting.

---

### 3. Recycle Repository - Missing Analytics Methods

**Problem:** Can only get all entries or by email. No aggregation for statistics.

**Missing Methods:**

```typescript
// TOTAL CARBON SAVED (for "how much carbon have we saved?")
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

// RECYCLING STATISTICS (for admin/recycleMan queries)
async getRecyclingStatistics(): Promise<{
  totalEntries: number;
  totalCarbonSaved: number;
  totalWeight: number;
  entryCount: number;
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
    entryCount: 0,
  };
}

// PENDING RECYCLING REQUESTS (for recycleMan)
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

**Why Needed:** RecycleMan and admins need "show pending requests," "total carbon saved," etc.

---

### 4. Order Repository - Missing Recent Orders

**Problem:** Has analytics, but no "recent orders" method.

**Missing Methods:**

```typescript
// RECENT ORDERS (for admin dashboard or chatbot "recent orders")
async getRecentOrders(limit: number = 10): Promise<IOrder[]> {
  return await OrderModel.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'firstName lastName email')
    .lean<IOrder[]>()
    .exec();
}

// ORDERS BY STATUS (for "show pending orders")
async getOrdersByStatus(status: OrderStatus, limit: number = 20): Promise<IOrder[]> {
  return await OrderModel.find({ status })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean<IOrder[]>()
    .exec();
}

// TOTAL REVENUE (for "what's our total revenue?")
async getTotalRevenue(): Promise<number> {
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

**Why Needed:** Chatbot queries like "show recent orders" or "pending orders."

---

### 5. Event Repository - Missing Statistics

**Problem:** Can get events, but no aggregation for stats.

**Missing Methods:**

```typescript
// UPCOMING EVENTS (limited, for chatbot)
async getUpcomingEvents(limit: number = 10): Promise<IEvent[]> {
  const users = await UserModel.aggregate([
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
        newRoot: "$events",
      },
    },
  ]);
  return users;
}

// TOTAL EVENTS COUNT
async getTotalEventsCount(): Promise<number> {
  const result = await UserModel.aggregate([
    { $unwind: "$events" },
    { $count: "total" },
  ]).exec();
  return result[0]?.total || 0;
}

// EVENTS BY ORGANIZER (for "show my events" - already exists but needs limiting)
async getEventsByOrganizerLimited(userId: string, limit: number = 10) {
  const user = await UserModel.findById(userId, { events: 1 })
    .lean<{ events: IEvent[] }>()
    .exec();

  return (user?.events || [])
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
    .slice(0, limit);
}

// EVENT STATISTICS (for admin)
async getEventStatistics(): Promise<{
  totalEvents: number;
  upcomingEvents: number;
  totalAttendees: number;
}> {
  const result = await UserModel.aggregate([
    { $unwind: "$events" },
    {
      $group: {
        _id: null,
        totalEvents: { $count: {} },
        upcomingEvents: {
          $sum: {
            $cond: [{ $gte: ["$events.eventDate", new Date()] }, 1, 0],
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
```

**Why Needed:** Queries like "show upcoming events," "how many events," "event statistics."

---

### 6. User Repository - Missing Count Methods

**Problem:** Has advanced methods, but no quick counts for chatbot.

**Missing Methods:**

```typescript
// TOTAL USERS COUNT BY ROLE
async getUserCountByRole(role?: UserRole): Promise<number> {
  if (role) {
    return await UserModel.countDocuments({ role }).exec();
  }
  return await UserModel.countDocuments().exec();
}

// USER GROWTH (for "how many users this month?")
async getRecentUserCount(days: number = 30): Promise<number> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await UserModel.countDocuments({
    createdAt: { $gte: startDate },
  }).exec();
}

// TOP USERS BY POINTS (for "top earners" or leaderboard)
async getTopUsersByPoints(limit: number = 10): Promise<IUser[]> {
  return await UserModel.find({ role: "customer" })
    .sort({ points: -1 })
    .limit(limit)
    .select("firstName lastName points email")
    .lean<IUser[]>()
    .exec();
}
```

**Why Needed:** Chatbot queries like "how many customers?" or "user growth this month."

---

## 🎯 Priority Implementation Order

### Phase 1: Critical (Do First)

These are most likely to be queried by chatbot:

1. **Product Repository:**

   - `getTopProductsByRating()`
   - `getCheapestProducts()`
   - `getTotalProductCount()`

2. **Restaurant Repository:**

   - `getTopRestaurantsByRating()`
   - `getTotalRestaurantCount()`

3. **Recycle Repository:**

   - `getTotalCarbonSaved()`
   - `getPendingRecyclingRequests()`

4. **Order Repository:**
   - `getRecentOrders()`
   - `getTotalRevenue()`

### Phase 2: Important (Admin/Role-Specific)

These support role-specific queries:

5. **Event Repository:**

   - `getUpcomingEvents()`
   - `getEventStatistics()`

6. **User Repository:**
   - `getUserCountByRole()`
   - `getRecentUserCount()`

### Phase 3: Nice-to-Have (Analytics)

These enhance analytics:

7. **Product Repository:**

   - `getMostSustainableProducts()`

8. **Restaurant Repository:**

   - `getRestaurantsWithMostProducts()`

9. **Recycle Repository:**
   - `getRecyclingStatistics()`

---

## 📊 Impact Assessment

### Without These Methods:

- ❌ Chatbot would load entire collections → **token overflow**
- ❌ Slow queries (sorting/filtering in memory)
- ❌ Can't answer: "top products," "how many X," "show recent Y"
- ❌ Poor performance with scale

### With These Methods:

- ✅ Efficient database-level aggregation
- ✅ Limited results (10-20 items max)
- ✅ Fast queries
- ✅ Token-efficient (only necessary data)
- ✅ Can answer all common chatbot queries

---

## 💡 Recommendation

**Add these methods before implementing the chatbot.** They take ~2-3 hours to add but will save you from major issues:

1. Token limits hit when trying to send entire collections to AI
2. Slow chatbot responses
3. Inability to answer common questions

**Estimate:** 15 new methods × 10 minutes each = **2.5 hours of work**

---

## ✅ Summary

| Repository     | Status    | Missing Methods | Priority  |
| -------------- | --------- | --------------- | --------- |
| **Product**    | 70% Ready | 4 methods       | 🔴 High   |
| **Restaurant** | 75% Ready | 3 methods       | 🔴 High   |
| **Recycle**    | 50% Ready | 4 methods       | 🔴 High   |
| **Order**      | 90% Ready | 3 methods       | 🟡 Medium |
| **Event**      | 70% Ready | 4 methods       | 🟡 Medium |
| **User**       | 85% Ready | 3 methods       | 🟢 Low    |

**Total Missing:** 21 methods  
**Critical:** 11 methods  
**Time to Implement:** ~2.5-3 hours
