# Pre-Phase 1 Backend Audit - AI Chatbot Readiness

> **Date:** 2025-12-23  
> **Purpose:** Comprehensive check before AI integration Phase 1

---

## ✅ What We Have

### 1. Analytics Methods (25 total) ✅

- **Product**: 6 methods (2 category + 4 analytics)
- **Restaurant**: 5 methods (2 category + 3 analytics)
- **Recycle**: 4 methods (2 core + 2 additional)
- **Order**: 3 methods
- **Event**: 4 methods
- **User**: 3 methods

### 2. Dependency Injection ✅

All repositories properly registered in `container.ts`:

- ✅ IUserRepository
- ✅ IRestaurantRepository
- ✅ ProductRepository
- ✅ OrderRepository
- ✅ RecycleRepository
- ✅ IEventRepository
- ✅ AIRepository

### 3. Current AI Repository ✅

Basic structure exists with:

- `getProductContext()` - Product page context
- `getRestaurantContext()` - Restaurant page context
- `getStaticPageContext()` - Static page descriptions
- `getGlobalStructure()` - Database snapshot (minimal)
- `getGeneralContext()` - System info

---

## ⚠️ GAPS - What We Need Before Phase 1

### 1. Missing Repository Injections ❌ CRITICAL

**Current AIRepository Constructor:**

```typescript
constructor(
  @inject("ProductRepository") private readonly productRepository: IProductRepository,
  @inject("IRestaurantRepository") private readonly restaurantRepository: IRestaurantRepository,
) {}
```

**Missing:**

- ❌ UserRepository (for getUserContext)
- ❌ OrderRepository (for order-related queries)
- ❌ RecycleRepository (for recycling data)
- ❌ EventRepository (for events data)

**Fix Required:**

```typescript
constructor(
  @inject("ProductRepository") private readonly productRepository: IProductRepository,
  @inject("IRestaurantRepository") private readonly restaurantRepository: IRestaurantRepository,
  @inject("IUserRepository") private readonly userRepository: IUserRepository,
  @inject("OrderRepository") private readonly orderRepository: IOrderRepository,
  @inject("RecycleRepository") private readonly recycleRepository: IRecycleRepository,
  @inject("IEventRepository") private readonly eventRepository: IEventRepository,
) {}
```

---

### 2. Missing Context Methods ❌ CRITICAL

#### A. getUserContext() - Not Implemented

```typescript
async getUserContext(userId: string): Promise<UserContextDTO> {
  const user = await this.userRepository.getById(userId);
  const orders = await this.orderRepository.getOrdersByUser(userId);
  const recycling = await this.recycleRepository.getRecycleEntriesByEmail(user.email);

  return {
    userId: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    points: user.points,
    favoritesCount: user.favoritesIds?.length || 0,
    cartItemsCount: user.cart?.length || 0,
    ordersCount: orders.length,
    recyclingEntriesCount: recycling.length,
  };
}
```

#### B. getRestaurantOwnerContext() - Not Implemented

For restaurant owners to query their own stats:

```typescript
async getRestaurantOwnerContext(restaurantId: string): Promise<RestaurantOwnerContextDTO> {
  const restaurant = await this.restaurantRepository.getById(restaurantId);
  const orders = await this.orderRepository.activeOrdersByRestaurantId(restaurantId);
  const revenue = await this.orderRepository.revenuePerRestaurant(restaurantId);

  return {
    restaurantId: restaurant._id,
    name: restaurant.name,
    email: restaurant.email,
    productsCount: restaurant.menus?.length || 0,
    ordersCount: orders.length,
    totalRevenue: revenue[0]?.revenue || 0,
    subscribed: restaurant.subscribed,
  };
}
```

#### C. Enhanced getGlobalStructure() - Incomplete

Current version only shows restaurants. Needs:

```typescript
async getGlobalStructure(): Promise<string> {
  const [users, restaurants, products, totalRevenue, carbonSaved, upcomingEvents] = await Promise.all([
    this.userRepository.getAll(),
    this.restaurantRepository.getAll(),
    this.productRepository.getTotalProductCount(),  // Use our new method!
    this.orderRepository.getTotalRevenue(),          // Use our new method!
    this.recycleRepository.getTotalCarbonSaved(),    // Use our new method!
    this.eventRepository.getUpcomingEvents(5),       // Use our new method!
  ]);

  const restaurantCount = restaurants.data?.length || restaurants.length;

  return `
    REAL TIME DATABASE SNAPSHOT:
    - Total Users: ${users.length}
    - Total Restaurants: ${restaurantCount}
    - Total Products: ${products}
    - Total Revenue: $${totalRevenue}
    - Carbon Saved: ${carbonSaved} kg
    - Upcoming Events: ${upcomingEvents.length}
  `;
}
```

---

### 3. Missing DTOs ❌ CRITICAL

Need to add to `ai-context.dto.ts`:

```typescript
// Message interface for conversation history
export interface Message {
  role: "user" | "assistant";
  content: string;
}

// User context DTO
export interface UserContextDTO {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "customer" | "organizer" | "admin" | "recycleMan";
  points: number;
  favoritesCount: number;
  cartItemsCount: number;
  ordersCount?: number;
  recyclingEntriesCount?: number;
  eventsCount?: number;
}

// Restaurant owner context DTO
export interface RestaurantOwnerContextDTO {
  restaurantId: string;
  name: string;
  email: string;
  productsCount: number;
  ordersCount: number;
  totalRevenue?: number;
  subscribed: boolean;
}

// Update ChatRequestDTO
export interface ChatRequestDTO {
  message: string;
  conversationHistory?: Message[]; // ADD THIS
  context?: { type: types; id?: string };
}

// Update types to include "user"
export type types = "product" | "restaurant" | "static" | "user"; // ADD "user"
```

---

### 4. Interface Updates Needed ❌

Update `IAIRepository` interface:

```typescript
export interface IAIRepository {
  // Existing
  getProductContext(productId: string): Promise<ProductContextDTO | null>;
  getRestaurantContext(
    restaurantId: string
  ): Promise<RestaurantContextDTO | null>;
  getStaticPageContext(pageId: string): string;
  getGlobalStructure(): Promise<string>;
  getGeneralContext(): GeneralContextDTO;

  // NEW - Need to add
  getUserContext(userId: string): Promise<UserContextDTO>;
  getRestaurantOwnerContext(
    restaurantId: string
  ): Promise<RestaurantOwnerContextDTO>;
}
```

---

### 5. Potential Data Access Issues ⚠️

#### A. User Events Access

The `UserContextDTO` needs `eventsCount` for organizers, but:

- Events used to be in UserModel as subdocuments
- Now they're in separate EventModel
- Need to verify: `eventRepository.getEventsByUserId(userId)` exists

**Check Required:**

```typescript
// Does this method exist and work?
const userEvents = await this.eventRepository.getEventsByUserId(userId);
```

#### B. Carbon Saved Per User

If user asks "How much carbon have **I** saved?" we need:

- Current: `getTotalCarbonSaved()` returns platform total
- Needed: Calculate from `getRecycleEntriesByEmail(email)` on the fly

**Solution:** Use existing method:

```typescript
const userRecycling = await this.recycleRepository.getRecycleEntriesByEmail(
  user.email
);
const userCarbon = userRecycling.reduce(
  (sum, r) => sum + (r.totalCarbonSaved || 0),
  0
);
```

---

## 📋 Pre-Phase 1 Checklist

### Must Do Before Phase 1:

- [ ] **Add repository injections** to AIRepository (User, Order, Recycle, Event)
- [ ] **Implement getUserContext()** method
- [ ] **Implement getRestaurantOwnerContext()** method
- [ ] **Enhance getGlobalStructure()** to use our new analytics methods
- [ ] **Add new DTOs** (Message, UserContextDTO, RestaurantOwnerContextDTO)
- [ ] **Update ChatRequestDTO** to include conversationHistory
- [ ] **Update IAIRepository** interface with new method signatures
- [ ] **Verify EventRepository** methods work with refactored Event model

### Should Consider:

- [ ] Add `getEventContext(eventId)` for event page chatbot context
- [ ] Add error handling for missing/null data in context methods
- [ ] Add logging for debugging context generation
- [ ] Consider caching frequently accessed data (global structure)

---

## 🎯 Summary

**Current State:** Backend has all analytics methods (25 total) ✅  
**Blocker:** AI Repository not connected to all data sources ❌

**Action Required:**

1. Wire up missing repositories to AIRepository (4 repositories)
2. Implement 2 new context methods (User + Restaurant Owner)
3. Add 3 new DTOs
4. Enhance getGlobalStructure() to leverage our analytics methods

**Time Estimate:** ~1 hour of work before Phase 1 can begin

---

## 💡 Why This Matters

Without these changes:

- ❌ AI can't answer "Show my orders" (no User context)
- ❌ AI can't answer "My revenue" (no Restaurant Owner context)
- ❌ AI can't see full platform stats (incomplete global structure)
- ❌ Conversation history won't work (no DTO)

With these changes:

- ✅ AI can answer all role-specific queries
- ✅ AI has accurate, real-time platform data
- ✅ Conversation context will work
- ✅ Ready for Phase 1 implementation

---

**Recommendation:** Fix these gaps BEFORE starting Phase 1 to avoid backtracking.
