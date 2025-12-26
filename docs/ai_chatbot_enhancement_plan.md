# AI Chatbot Enhancement Plan

## Overview

Enhance the EcoSphere AI chatbot to:

1. Access **all database collections** (users, restaurants, products, orders, recycling entries, events)
2. Use **AI-powered language detection** - responds in the same language as the user's message
3. Support **6 user types** with appropriate data access for each
4. Handle **authenticated and guest queries** intelligently
5. Maintain **conversation history** for contextual responses
6. Provide **graceful error handling** and user feedback mechanisms

## User Types & Access Levels

| User Type           | Auth                   | Public Routes                                           | Private Routes                          |
| ------------------- | ---------------------- | ------------------------------------------------------- | --------------------------------------- |
| **Guest**           | ❌ No                  | ✅ Browse products, restaurants, events, recycling info | ❌ None                                 |
| **Customer**        | ✅ Yes                 | ✅ All public routes                                    | ✅ My orders, points, favorites, cart   |
| **Restaurant/Shop** | ✅ Yes (separate auth) | ✅ All public routes                                    | ✅ CRUD products, shop stats, orders    |
| **Organizer**       | ✅ Yes                 | ✅ All public routes                                    | ✅ Create/manage events, attendees      |
| **RecycleMan**      | ✅ Yes                 | ✅ All public routes                                    | ✅ Manage recycling requests            |
| **Admin**           | ✅ Yes                 | ✅ All public routes                                    | ✅ Platform-wide statistics, manage all |

### Example Queries by User Type

**Guest (no auth):**

- "What products are available?"
- "Show me restaurants near me"
- "How does recycling work on this platform?"
- "Explain your sustainability score"

**Customer:**

- All guest queries **+**
- "Show my orders"
- "What are my favorite products?"
- "How many points do I have?"
- "What's in my cart?"
- "Track my order #12345"

**Restaurant/Shop:**

- All guest queries **+**
- "How many products do I have?"
- "Show my revenue statistics"
- "What are my top-selling products?"
- "Show orders for my restaurant"

**Organizer:**

- All guest queries **+**
- "Show my created events"
- "How many attendees do I have?"
- "What are my upcoming events?"

**RecycleMan:**

- All guest queries **+**
- "Show pending recycling requests"
- "What are today's pickups?"
- "How much carbon have we saved?"

**Admin:**

- All guest queries **+**
- "Total platform revenue"
- "How many users signed up this month?"
- "Show platform statistics"
- "What's the total carbon saved?"

## Authentication Strategy

The system has **two separate authentication models:**

1. **UserModel** - for customers, organizers, recycleMan, admin
2. **RestaurantModel** - for restaurant/shop owners

The AI controller will:

- Check session for user authentication (`session.user.id`)
- Check session for restaurant authentication (`session.restaurant.id` or similar)
- Pass both to the AI service to determine user type and data access

## Core Features

### 1. Database Access (Primary Enhancement)

- ✅ Access all collections: users, restaurants, products, orders, recycling, events
- ✅ Role-based data filtering
- ✅ Real-time platform statistics

### 2. Language Detection (Primary Enhancement)

- ✅ AI-powered language detection (no manual logic needed)
- ✅ Supports English, Arabic, French
- ✅ Responds in user's language automatically

### 3. Conversation History (Standard Feature)

**Status:** ⚠️ Currently NOT implemented

**Why it's needed:**

- Users can ask follow-up questions: "Tell me more about that"
- Context-aware responses: "What about the previous product?"
- Better user experience with natural conversation flow

**Implementation approach:**

- Frontend: Store conversation history in `useAIChat` hook state
- Backend: Accept `conversationHistory` in request
- AI Service: Include previous 3-5 messages in context for the LLM

### 4. Error Handling (Standard Feature)

**Status:** ⚠️ Needs enhancement

**Current gaps:**

- Generic error messages
- No retry mechanism
- No specific error types for different failures

**Recommended improvements:**

- User-friendly error messages based on error type
- Graceful degradation (e.g., "I couldn't access order data, but I can help with general questions")
- Network error detection with retry suggestion

### 5. Rate Limiting (Standard Feature - Security)

**Status:** ❌ NOT implemented

**Why it's needed:**

- Prevent API abuse
- Control costs (Hugging Face API calls)
- Protect against spam

**Recommended approach:**

- Use existing middleware or add simple rate limiting
- Limit: 20 messages per user per minute
- Return clear rate limit error

### 6. Suggested Prompts (UX Enhancement)

**Status:** ⚠️ Could be added

**Why it's useful:**

- Helps users discover chatbot capabilities
- Reduces blank screen confusion
- Role-specific suggestions

**Implementation:**

- Frontend: Display role-specific prompt buttons
- Examples: "Show my orders", "Browse products", "Recycling guide"

### 7. Typing Indicator (UX Enhancement)

**Status:** ✅ Already implemented (`isLoading` state)

### 8. Feedback Mechanism (Quality Improvement)

**Status:** ❌ NOT implemented

**Why it's useful:**

- Track query satisfaction
- Identify poor responses
- Improve prompts over time

**Recommended approach:**

- Add thumbs up/down to each AI message
- Store feedback in database for analytics
- Optional: Ask "Was this helpful?"

## Additional Features to Consider (Future)

### 9. Streaming Responses (Advanced UX)

- Stream AI responses word-by-word for better perceived performance
- Requires SSE (Server-Sent Events) or WebSocket
- **Priority:** Low (current implementation is fast enough)

### 10. Conversation Persistence (Database)

- Save chat history to database
- Users can view previous conversations
- **Priority:** Low (session-based history is sufficient for now)

### 11. Image Upload (Recycling Verification)

- Users upload images for bulk recycling item detection
- Already exists as separate feature (`vision_bulk_recycling_plan.md`)
- **Priority:** Low (already implemented separately)

### 12. Voice Input/Output (Accessibility)

- Voice-to-text and text-to-voice
- **Priority:** Low (nice-to-have for accessibility)

## Proposed Changes

### Backend - AI Repository

#### [MODIFY] [ai.repository.ts](file:///e:/Graduation%20Project/EcoSphere/src/backend/features/ai/ai.repository.ts)

**Changes:**

- Inject `IUserRepository`, `IOrderRepository`, `IRecycleRepository`, and `IRestaurantRepository`
- Add `getUserContext(userId: string): Promise<UserContextDTO>` - fetch user data by role
- Add `getRestaurantContext(restaurantId: string): Promise<RestaurantContextDTO>` - fetch shop owner data
- Update `getGlobalStructure()` for comprehensive database snapshot:
  - Total users (by role)
  - Total restaurants
  - Total products
  - Recent orders count
  - Recycling statistics
  - Total events
  - Platform-wide metrics

---

### Backend - AI Service

#### [MODIFY] [ai.service.ts](file:///e:/Graduation%20Project/EcoSphere/src/backend/features/ai/ai.service.ts)

**Changes:**

- Update signature: `generateResponse(userMessage: string, conversationHistory?: Message[], context?: ContextType, userId?: string, restaurantId?: string)`
- **Remove `locale` parameter** entirely
- **Add `conversationHistory` parameter** for context-aware responses
- Update system prompt:
  - "Reply in the same language as the user's message"
  - Define 6 user types and their access levels
  - Explain when to ask users to log in
  - Include conversation history in context
- Remove `getLanguage()` helper
- Improve error handling with specific error types

**System Prompt:**

```
You are the EcoSphere Assistant, a helpful AI for a sustainability marketplace.
Tone: Encouraging, green, emoji-friendly 🌱.
Constraint: Keep answers concise (under 3 sentences).
Reply in the same language as the user's message.

User Types & Access:
1. Guest (no auth): Can browse products, restaurants, events, recycling info
2. Customer: Guest access + orders, points, favorites, cart
3. Restaurant/Shop: Guest access + manage products, view sales stats, orders
4. Organizer: Guest access + create/manage events, attendees
5. RecycleMan: Guest access + manage recycling requests
6. Admin: Full platform access and statistics

Authentication Rules:
- For personal queries without auth context, politely tell user to log in
- Guest queries are always available
- Determine user type from provided context (userId with role OR restaurantId)

Conversation Context:
- Previous messages are provided for context
- Reference previous conversation when relevant
- Example: If user asks "tell me more", refer to the previous topic

Knowledge Base: Use the provided JSON context to answer questions.
```

---

### Backend - DTOs

#### [MODIFY] [ai-context.dto.ts](file:///e:/Graduation%20Project/EcoSphere/src/backend/features/ai/dto/ai-context.dto.ts)

**Changes:**

- Update context types: `types = "product" | "restaurant" | "static" | "user"`
- Add comprehensive DTOs:

```typescript
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
  eventsCount?: number; // for organizers
}

export interface RestaurantOwnerContextDTO {
  restaurantId: string;
  name: string;
  email: string;
  productsCount: number;
  ordersCount: number;
  totalRevenue?: number;
  subscribed: boolean;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequestDTO {
  message: string;
  conversationHistory?: Message[]; // NEW: For context-aware responses
  context?: { type: types; id?: string };
}
```

---

### Backend - Controller

#### [MODIFY] [ai.controller.ts](file:///e:/Graduation%20Project/EcoSphere/src/backend/features/ai/ai.controller.ts)

**Changes:**

- Import `auth` from `@/auth`
- Get session and extract both user and restaurant IDs
- Pass conversation history to service
- Improve error handling

```typescript
async chatWithAssistant(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();

    // Extract authentication info
    const userId = session?.user?.id;
    const restaurantId = session?.restaurant?.id; // Check session structure

    const body = await req.json() as ChatRequestDTO;

    if (!body?.message || typeof body.message !== "string")
      return badRequest("Message is required");

    // Validate conversation history
    const conversationHistory = Array.isArray(body.conversationHistory)
      ? body.conversationHistory.slice(-5) // Keep last 5 messages for context
      : undefined;

    const answer = await this.aiService.generateResponse(
      body.message,
      conversationHistory,
      body.context,
      userId,
      restaurantId
    );

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("AI Controller Error:", error);

    // Improved error messages
    if (error.message?.includes("rate limit")) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    return serverError("I'm having trouble right now. Please try again in a moment.");
  }
}
```

---

### Frontend - Hook

#### [MODIFY] [useAIChat.ts](file:///e:/Graduation%20Project/EcoSphere/src/hooks/useAIChat.ts)

**Changes:**

- Remove `useLocale` import and usage
- Remove `locale` from API request
- **Add conversation history to API calls**
- Backend handles authentication via session

```typescript
const sendMessage = async (content: string) => {
  const userMessage: Message = { role: "user", content };
  setMessages((prev) => [...prev, userMessage]);
  setIsLoading(true);

  try {
    const context = determineContext(pathname || "");

    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: content,
        conversationHistory: messages, // NEW: Send conversation history
        context: context,
      }),
    });

    if (!response.ok) {
      // Improved error handling
      if (response.status === 429) {
        throw new Error("rate_limit");
      }
      throw new Error("Failed to fetch response");
    }

    const data = await response.json();
    const aiMessage: Message = { role: "assistant", content: data.answer };

    setMessages((prev) => [...prev, aiMessage]);
  } catch (error: any) {
    console.error("Chat error:", error);

    let errorMessage = t("connection");
    if (error.message === "rate_limit") {
      errorMessage = "Too many requests. Please wait a moment.";
    }

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: errorMessage },
    ]);
  } finally {
    setIsLoading(false);
  }
};
```

---

### Backend - Dependency Injection

#### [MODIFY] [container.ts](file:///e:/Graduation%20Project/EcoSphere/src/backend/config/container.ts)

**Changes:**

- Verify all repositories are registered:
  - `UserRepository`
  - `RestaurantRepository`
  - `OrderRepository`
  - `RecycleRepository`

---

## Verification Plan

### 1. Guest Queries (No Auth)

- "What products are available?" → Lists products in English
- "كم عدد المطاعم؟" → Arabic response with restaurant count
- "Comment fonctionne le recyclage?" → French response about recycling

### 2. Customer Queries (Logged In)

- **General:** "Show me products" → Lists products
- **Personal:** "Show my orders" → Lists user's orders
- **Personal:** "How many points do I have?" → Shows points
- **Personal (logged out):** "Show my orders" → "Please log in to view your orders 🔒"

### 3. Restaurant Queries (Logged In as Shop)

- **General:** "What are the top products?" → Lists platform products
- **Personal:** "How many products do I have?" → Shows restaurant's product count
- **Personal:** "Show my sales statistics" → Restaurant revenue/orders
- **Personal:** "What are my top-selling products?" → Restaurant's best sellers

### 4. Organizer Queries (Logged In)

- **General:** "What events are available?" → Lists all events
- **Personal:** "Show my events" → Lists organizer's events
- **Personal:** "How many attendees do I have?" → Attendee statistics

### 5. RecycleMan Queries (Logged In)

- **General:** "Tell me about recycling" → General recycling info
- **Personal:** "Show pending requests" → Recycling requests to handle
- **Personal:** "What are today's pickups?" → Today's recycling schedule

### 6. Admin Queries (Logged In)

- **General:** Any guest query
- **Personal:** "Total platform revenue" → Revenue statistics
- **Personal:** "How many users this month?" → User growth data
- **Personal:** "Platform statistics" → Comprehensive stats

### 7. Context-Aware Queries

- Navigate to product page → "ما هذا؟" → Arabic response about product
- Navigate to restaurant page → "Tell me about this shop" → English response

### 8. Language Detection

- English: "What products do you have?" → English response
- Arabic: "أرني طلباتي" → Arabic response (if logged in)
- French: "Montre-moi mes commandes" → French response (if logged in)

### 9. Conversation History

- User: "Show me products"
- AI: "Here are our eco-friendly products..."
- User: "Tell me more about the first one" (**NEW TEST**)
- AI: Should reference the first product from previous message

### 10. Error Handling

- Test with invalid API token → User-friendly error message
- Test rate limiting → Clear rate limit message
- Test network failure → Graceful error with retry suggestion

## Summary of Missing Features

### ✅ Already Implementing:

1. Database access to all collections
2. AI language detection
3. Role-based access control
4. Authentication handling

### ⚠️ Recommended to Add:

1. **Conversation history** (for context-aware follow-up questions)
2. **Improved error handling** (user-friendly messages)
3. **Rate limiting** (prevent abuse)

### 📋 Optional (Future):

1. Suggested prompts (UX enhancement)
2. Feedback mechanism (thumbs up/down)
3. Conversation persistence (database storage)
4. Streaming responses (advanced UX)

## Next Steps

1. **Review this plan** - Confirm all features align with project goals
2. **Decide on optional features** - Which ones to include in initial implementation?
3. **Begin implementation** - Start with core features (database access, language detection, auth)
4. **Add conversation history** - Implement context-aware responses
5. **Add error handling** - Improve user experience with graceful errors
6. **Test thoroughly** - Follow verification plan for all user types
