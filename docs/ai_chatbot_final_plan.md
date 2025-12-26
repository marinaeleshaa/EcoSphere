# EcoSphere AI Chatbot - Final Implementation Plan

> **Status:** Ready for Implementation  
> **Last Updated:** 2025-12-23  
> **Author:** Development Team

## Executive Summary

This plan outlines the enhancement of the EcoSphere AI chatbot to be a comprehensive, intelligent assistant supporting all 6 user types with full database access, multilingual support, and enhanced UX features.

**Core Enhancements:**

1. ✅ Full database access (all collections)
2. ✅ AI-powered language detection
3. ✅ 6 user role support with authentication
4. ✅ Conversation history for context-aware responses
5. ✅ Improved error handling
6. ✅ Role-based suggested prompts
7. ✅ Feedback mechanism

---

## Table of Contents

1. [User Types & Access](#user-types--access)
2. [Core Features](#core-features)
3. [Technical Implementation](#technical-implementation)
4. [Suggested Prompts by Role](#suggested-prompts-by-role)
5. [Feedback System](#feedback-system)
6. [Verification Plan](#verification-plan)
7. [Implementation Checklist](#implementation-checklist)

---

## User Types & Access

### Access Matrix

| User Type           | Auth        | Public Routes                                   | Private Routes                  |
| ------------------- | ----------- | ----------------------------------------------- | ------------------------------- |
| **Guest**           | ❌ No       | Browse products, restaurants, events, recycling | None                            |
| **Customer**        | ✅ Yes      | All public routes                               | Orders, points, favorites, cart |
| **Restaurant/Shop** | ✅ Separate | All public routes                               | CRUD products, stats, orders    |
| **Organizer**       | ✅ Yes      | All public routes                               | Manage events, attendees        |
| **RecycleMan**      | ✅ Yes      | All public routes                               | Manage recycling requests       |
| **Admin**           | ✅ Yes      | All public routes                               | Platform stats, full management |

### Authentication Models

1. **UserModel** - customers, organizers, recycleMan, admin
2. **RestaurantModel** - restaurant/shop owners (separate authentication)

---

## Core Features

### 1. Full Database Access ✅ Core

**What:** Access all collections in the database  
**Collections:** Users, Restaurants, Products, Orders, Recycling Entries, Events

**Implementation:**

- Inject all repositories into AIRepository
- Create context getters for each data type
- Update global structure to include all statistics

### 2. AI Language Detection ✅ Core

**What:** Automatically respond in user's language  
**Languages:** English, Arabic, French

**Implementation:**

- Remove `locale` parameter from frontend/backend
- Add to system prompt: "Reply in the same language as the user's message"
- AI natively detects and responds in correct language

### 3. Conversation History ✅ Core

**What:** Remember previous messages for context-aware responses

**Why Essential:**

- Users ask follow-ups: "Tell me more about that"
- Natural conversation flow
- Better UX

**Implementation:**

```typescript
// Frontend - send last messages
conversationHistory: messages.slice(-5);

// Backend - include in LLM context
const conversationContext = conversationHistory
  .map((m) => `${m.role}: ${m.content}`)
  .join("\n");
```

### 4. Enhanced Error Handling ✅ Core

**What:** User-friendly error messages and graceful degradation

**Error Types:**

- Rate limit → "Too many requests. Please wait a moment."
- Auth required → "Please log in to view your [data]"
- Data unavailable → "I couldn't access [data], but I can help with general questions"
- Network error → "Connection issue. Please try again."

**Implementation:**

```typescript
// Specific error handling
if (error.message?.includes("rate limit")) {
  return userFriendlyError("Too many requests...");
}
if (error.message?.includes("not authenticated")) {
  return userFriendlyError("Please log in to view this information");
}
```

### 5. Role-Based Suggested Prompts ✅ Core

**What:** Quick action buttons based on user role

**Why Essential:**

- Helps users discover capabilities
- Reduces friction
- Role-specific guidance

**See [Suggested Prompts by Role](#suggested-prompts-by-role) section below**

### 6. Feedback Mechanism ✅ Core

**What:** Thumbs up/down on AI responses

**Why Essential:**

- Track satisfaction
- Identify poor responses
- Continuous improvement

**Implementation:**

```typescript
interface ChatFeedback {
  messageId: string;
  userId?: string;
  userMessage: string;
  aiResponse: string;
  rating: "positive" | "negative";
  context?: { type: string; id?: string };
  timestamp: Date;
}
```

**See [Feedback System](#feedback-system) section below**

---

## Technical Implementation

### Backend - AI Repository

**File:** `src/backend/features/ai/ai.repository.ts`

**Changes:**

```typescript
@injectable()
export class AIRepository implements IAIRepository {
  constructor(
    @inject("ProductRepository") private productRepo: IProductRepository,
    @inject("IRestaurantRepository")
    private restaurantRepo: IRestaurantRepository,
    @inject("IUserRepository") private userRepo: IUserRepository, // NEW
    @inject("IOrderRepository") private orderRepo: IOrderRepository, // NEW
    @inject("IRecycleRepository") private recycleRepo: IRecycleRepository // NEW
  ) {}

  // NEW: Get user context
  async getUserContext(userId: string): Promise<UserContextDTO> {
    const user = await this.userRepo.getById(userId);
    const orders = await this.orderRepo.getOrdersByUser(userId);
    const recycling = await this.recycleRepo.getRecycleEntriesByEmail(
      user.email
    );

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
      eventsCount:
        user.role === "organizer" ? user.events?.length || 0 : undefined,
    };
  }

  // NEW: Get restaurant context
  async getRestaurantContext(
    restaurantId: string
  ): Promise<RestaurantOwnerContextDTO> {
    const restaurant = await this.restaurantRepo.getById(restaurantId);
    const orders = await this.orderRepo.activeOrdersByRestaurantId(
      restaurantId
    );
    const revenue = await this.orderRepo.revenuePerRestaurant(restaurantId);

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

  // UPDATED: Enhanced global structure
  async getGlobalStructure(): Promise<string> {
    const [users, restaurants, products, orders, recycling, events] =
      await Promise.all([
        this.userRepo.getAll(),
        this.restaurantRepo.getAll(),
        this.productRepo.findAllProducts(),
        this.orderRepo.dailySales(),
        this.recycleRepo.listRecycleEntries(),
        // Event stats if you have event repository
      ]);

    return `
      REAL TIME DATABASE SNAPSHOT:
      - Total Users: ${users.length} (by role: ...)
      - Total Restaurants: ${restaurants.data?.length || restaurants.length}
      - Total Products: ${products.data.length}
      - Total Orders: ${orders.length}
      - Recycling Entries: ${recycling.length}
      - Carbon Saved: ${recycling.reduce(
        (sum, r) => sum + (r.totalCarbonSaved || 0),
        0
      )} kg
    `;
  }
}
```

---

### Backend - AI Service

**File:** `src/backend/features/ai/ai.service.ts`

**Changes:**

```typescript
// UPDATED: New signature with conversation history
async generateResponse(
  userMessage: string,
  conversationHistory?: Message[],  // NEW
  context?: { type: types; id?: string },
  userId?: string,                  // NEW
  restaurantId?: string             // NEW
): Promise<string> {
  if (!this.hfToken) {
    throw new Error('AI Service Unavailable');
  }

  // Get context based on authentication
  let userContext;
  if (userId) {
    userContext = await this.aiRepository.getUserContext(userId);
  } else if (restaurantId) {
    userContext = await this.aiRepository.getRestaurantContext(restaurantId);
  }

  const generalContext = this.aiRepository.getGeneralContext();
  const pageContext = await this.resolveContext(context);
  const globalStructure = await this.aiRepository.getGlobalStructure();

  // NEW: Build conversation history context
  const historyContext = conversationHistory?.length
    ? `\nRECENT CONVERSATION:\n${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}`
    : '';

  const systemContent = `
    You are the EcoSphere Assistant, a helpful AI for a sustainability marketplace.
    Tone: Encouraging, green, emoji-friendly 🌱.
    Constraint: Keep answers concise (under 3 sentences).
    Reply in the same language as the user's message.

    User Types & Access:
    1. Guest (no auth): Browse products, restaurants, events, recycling
    2. Customer: Guest + orders, points, favorites, cart
    3. Restaurant: Guest + manage products, stats, orders
    4. Organizer: Guest + manage events, attendees
    5. RecycleMan: Guest + manage recycling requests
    6. Admin: Full platform access

    Authentication Rules:
    - If user asks personal questions without auth, politely ask them to log in
    - Guest queries always available
    - Determine user type from context

    Conversation Context:
    - Use previous messages for context when available
    - If user says "tell me more", reference previous topic
    ${historyContext}

    USER CONTEXT:
    ${userContext ? JSON.stringify(userContext, null, 2) : 'No authentication - Guest user'}

    GLOBAL SNAPSHOT:
    ${globalStructure}

    PAGE CONTEXT:
    ${JSON.stringify({ generalContext, pageContext }, null, 2)}
  `;

  try {
    const messages = [
      { role: 'system', content: systemContent },
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.hfToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        max_tokens: 250,
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? 'No response generated.';
  } catch (error) {
    console.error('AIService Error:', error);
    // Enhanced error messages
    if (error.message?.includes('rate limit')) {
      throw new Error('RATE_LIMIT');
    }
    throw new Error('SERVICE_UNAVAILABLE');
  }
}
```

---

### Backend - DTOs

**File:** `src/backend/features/ai/dto/ai-context.dto.ts`

**Changes:**

```typescript
// NEW: Message interface for conversation history
export interface Message {
  role: "user" | "assistant";
  content: string;
}

// NEW: User context DTO
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

// NEW: Restaurant owner context DTO
export interface RestaurantOwnerContextDTO {
  restaurantId: string;
  name: string;
  email: string;
  productsCount: number;
  ordersCount: number;
  totalRevenue?: number;
  subscribed: boolean;
}

// UPDATED: Chat request DTO
export interface ChatRequestDTO {
  message: string;
  conversationHistory?: Message[]; // NEW
  context?: { type: types; id?: string };
}

// UPDATED: Add 'user' type
export type types = "product" | "restaurant" | "static" | "user";
```

---

### Backend - Controller

**File:** `src/backend/features/ai/ai.controller.ts`

**Changes:**

```typescript
import { auth } from '@/auth';

async chatWithAssistant(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();

    // Extract authentication
    const userId = session?.user?.id;
    const restaurantId = session?.restaurant?.id; // Verify session structure

    const body = await req.json() as ChatRequestDTO;

    if (!body?.message || typeof body.message !== 'string') {
      return badRequest('Message is required');
    }

    // Validate conversation history
    const conversationHistory = Array.isArray(body.conversationHistory)
      ? body.conversationHistory.slice(-5)  // Keep last 5 messages
      : undefined;

    const answer = await this.aiService.generateResponse(
      body.message,
      conversationHistory,  // NEW
      body.context,
      userId,              // NEW
      restaurantId         // NEW
    );

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error('AI Controller Error:', error);

    // Enhanced error handling
    if (error.message === 'RATE_LIMIT') {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    if (error.message === 'SERVICE_UNAVAILABLE') {
      return serverError("I'm having trouble right now. Please try again in a moment.");
    }

    return serverError('Failed to generate AI response');
  }
}
```

---

### Frontend - Hook

**File:** `src/hooks/useAIChat.ts`

**Changes:**

```typescript
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl"; // Keep for error messages only

export const useAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("AI.errors");

  // REMOVED: const locale = useLocale();

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
          // REMOVED: locale
        }),
      });

      if (!response.ok) {
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

  return {
    messages,
    isLoading,
    isOpen,
    toggleOpen: () => setIsOpen((prev) => !prev),
    sendMessage,
    clearChat: () => setMessages([]),
  };
};
```

---

## Suggested Prompts by Role

### Implementation

**File:** `src/components/layout/ai/SuggestedPrompts.tsx`

```typescript
interface SuggestedPromptsProps {
  userRole:
    | "guest"
    | "customer"
    | "restaurant"
    | "organizer"
    | "recycleMan"
    | "admin";
  onPromptClick: (prompt: string) => void;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({
  userRole,
  onPromptClick,
}) => {
  const prompts = ROLE_PROMPTS[userRole];

  return (
    <div className="suggested-prompts">
      <p className="prompt-header">Try asking:</p>
      <div className="prompt-grid">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt.text)}
            className="prompt-button"
          >
            <span className="prompt-icon">{prompt.icon}</span>
            <span className="prompt-text">{prompt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
```

### Prompts Definitions

```typescript
const ROLE_PROMPTS = {
  guest: [
    { icon: "🛍️", text: "Show me eco-friendly products" },
    { icon: "🍽️", text: "Find restaurants near me" },
    { icon: "♻️", text: "How does recycling work?" },
    { icon: "📊", text: "Explain sustainability scores" },
  ],
  customer: [
    { icon: "📦", text: "Show my orders" },
    { icon: "⭐", text: "View my favorites" },
    { icon: "🎯", text: "How many points do I have?" },
    { icon: "🛒", text: "What's in my cart?" },
  ],
  restaurant: [
    { icon: "📊", text: "Show my sales statistics" },
    { icon: "🍴", text: "List my products" },
    { icon: "💰", text: "What's my revenue?" },
    { icon: "🥇", text: "Top-selling products" },
  ],
  organizer: [
    { icon: "🎉", text: "Show my events" },
    { icon: "👥", text: "How many attendees?" },
    { icon: "📅", text: "Upcoming events" },
    { icon: "➕", text: "Create new event guide" },
  ],
  recycleMan: [
    { icon: "📋", text: "Pending recycling requests" },
    { icon: "🚚", text: "Today's pickups" },
    { icon: "♻️", text: "Carbon saved this month" },
    { icon: "📍", text: "Recycling locations" },
  ],
  admin: [
    { icon: "📊", text: "Platform statistics" },
    { icon: "💰", text: "Total revenue" },
    { icon: "👥", text: "User growth metrics" },
    { icon: "♻️", text: "Total carbon impact" },
  ],
};
```

---

## Feedback System

### Database Model

**File:** `src/backend/features/ai/feedback.model.ts`

```typescript
import { Document, model, models, Schema } from "mongoose";

export interface IChatFeedback extends Document {
  messageId: string;
  userId?: string;
  userMessage: string;
  aiResponse: string;
  rating: "positive" | "negative";
  context?: {
    type: string;
    id?: string;
  };
  timestamp: Date;
}

const chatFeedbackSchema = new Schema<IChatFeedback>({
  messageId: { type: String, required: true, unique: true },
  userId: { type: String, required: false },
  userMessage: { type: String, required: true },
  aiResponse: { type: String, required: true },
  rating: { type: String, enum: ["positive", "negative"], required: true },
  context: {
    type: {
      type: String,
      required: false,
    },
    id: {
      type: String,
      required: false,
    },
  },
  timestamp: { type: Date, default: Date.now },
});

chatFeedbackSchema.index({ userId: 1, timestamp: -1 });
chatFeedbackSchema.index({ rating: 1 });

export const ChatFeedbackModel =
  models.ChatFeedback ||
  model<IChatFeedback>("ChatFeedback", chatFeedbackSchema);
```

### API Endpoint

**File:** `src/app/api/ai/feedback/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { ChatFeedbackModel } from "@/backend/features/ai/feedback.model";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    const feedback = await ChatFeedbackModel.create({
      messageId: body.messageId,
      userId: session?.user?.id || undefined,
      userMessage: body.userMessage,
      aiResponse: body.aiResponse,
      rating: body.rating,
      context: body.context,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
```

### UI Component

**File:** `src/components/layout/ai/FeedbackButtons.tsx`

```typescript
interface FeedbackButtonsProps {
  messageId: string;
  userMessage: string;
  aiResponse: string;
  context?: { type: string; id?: string };
}

export const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({
  messageId,
  userMessage,
  aiResponse,
  context,
}) => {
  const [rating, setRating] = useState<"positive" | "negative" | null>(null);

  const submitFeedback = async (newRating: "positive" | "negative") => {
    if (rating) return; // Already rated

    setRating(newRating);

    try {
      await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          userMessage,
          aiResponse,
          rating: newRating,
          context,
        }),
      });
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  return (
    <div className="feedback-buttons">
      <button
        onClick={() => submitFeedback("positive")}
        className={rating === "positive" ? "active" : ""}
        disabled={rating !== null}
      >
        👍
      </button>
      <button
        onClick={() => submitFeedback("negative")}
        className={rating === "negative" ? "active" : ""}
        disabled={rating !== null}
      >
        👎
      </button>
    </div>
  );
};
```

---

## Verification Plan

### 1. Database Access

- [ ] Guest query: "How many products are there?" → Real count
- [ ] Admin query: "Show platform statistics" → Real stats
- [ ] Customer query: "Show my orders" → User's actual orders

### 2. Language Detection

- [ ] English: "What products do you have?" → English response
- [ ] Arabic: "ما هي المنتجات المتاحة؟" → Arabic response
- [ ] French: "Quels produits avez-vous?" → French response

### 3. Conversation History

- [ ] User: "Show me products"
- [ ] AI: Lists products
- [ ] User: "Tell me more about the first one"
- [ ] AI: References first product from previous message ✅

### 4. Error Handling

- [ ] Personal query while logged out → "Please log in..."
- [ ] Rate limit hit → "Too many requests..."
- [ ] Network error → "Connection issue..."

### 5. Suggested Prompts

- [ ] Guest sees guest prompts
- [ ] Customer sees customer prompts
- [ ] Restaurant sees restaurant prompts
- [ ] Etc. for all roles

### 6. Feedback

- [ ] Click thumbs up → Feedback stored
- [ ] Click thumbs down → Feedback stored
- [ ] View in admin dashboard

### 7. Role-Specific Queries

- [ ] Customer: "Show my points" → User's actual points
- [ ] Restaurant: "My revenue" → Restaurant's actual revenue
- [ ] Organizer: "My events" → Organizer's events
- [ ] RecycleMan: "Pending requests" → Recycling requests
- [ ] Admin: "Total carbon saved" → Platform total

---

## Backend Analytics Methods ✅ COMPLETE

**Status:** All 25 methods implemented (2025-12-23)

To enable efficient chatbot queries and avoid token overflow, we implemented comprehensive analytics methods across all repositories. These methods provide pre-aggregated, limited-result database queries.

### Implementation Summary

**Phase 1: Category Filtering (4 methods) ✅**

- Product: `getProductsByCategory()`, `getProductCategoryCounts()`
- Restaurant: `getRestaurantsByCategory()`, `getRestaurantCategoryCounts()`

**Phase 2: Core Analytics (11 methods) ✅**

- Product: `getTopProductsByRating()`, `getCheapestProducts()`, `getTotalProductCount()`, `getMostSustainableProducts()`
- Restaurant: `getTopRestaurantsByRating()`, `getTotalRestaurantCount()`
- Recycle: `getTotalCarbonSaved()`, `getPendingRecyclingRequests()`
- Order: `getRecentOrders()`, `getTotalRevenue()`
- Event: `getUpcomingEvents()`

**Phase 3: Additional Analytics (10 methods) ✅**

- Restaurant: `getRestaurantsWithMostProducts()`
- Recycle: `getRecyclingStatistics()`, `getRecentRecyclingEntries()`
- Order: `getOrdersByStatus()`
- Event: `getTotalEventsCount()`, `getEventStatistics()`, `getEventsByOrganizerLimited()`
- User: `getUserCountByRole()`, `getRecentUserCount()`, `getTopUsersByPoints()`

### Chatbot Queries Now Supported

✅ "Show me fruits" / "Find bakeries"  
✅ "Top-rated products" / "Cheapest items"  
✅ "How many restaurants?" / "Total carbon saved?"  
✅ "Pending requests" / "My revenue" / "Platform stats"

---

## Implementation Checklist

### Phase 0: Backend Analytics ✅ COMPLETE

- [x] Add 4 category filtering methods
- [x] Add 11 core analytics methods
- [x] Add 10 additional analytics methods

### Pre-Phase 1: Backend Preparation ✅ COMPLETE

- [x] Add new DTOs (Message, UserContextDTO, RestaurantOwnerContextDTO)
- [x] Update ChatRequestDTO with conversationHistory
- [x] Inject User, Order, Recycle, Event repositories into AIRepository
- [x] Implement getUserContext() method
- [x] Implement getRestaurantOwnerContext() method
- [x] Enhance getGlobalStructure() to use analytics methods
- [x] Update IAIRepository interface

### Phase 1: Core Database & Auth ✅ COMPLETE

- [x] Inject all repositories into AIRepository
- [x] Implement getUserContext()
- [x] Implement getRestaurantOwnerContext()
- [x] Update getGlobalStructure()
- [x] Update AIService signature (conversationHistory, userId, restaurantId)
- [x] Remove locale parameter (using AI language detection now)
- [x] Add userId and restaurantId parameters
- [x] Update AIController to extract session
- [x] Update system prompt for multi-role support
- [x] Update system prompt for AI language detection
- [x] Enhance error handling (RATE_LIMIT, SERVICE_UNAVAILABLE)

### Phase 2: Conversation History ✅ COMPLETE

- [x] Add Message interface to DTOs
- [x] Add conversationHistory to ChatRequestDTO
- [x] Update AIService to accept history
- [x] Include history in LLM context
- [x] Update frontend to send history
- [x] Remove locale parameter from frontend

### Phase 3: Error Handling ✅ COMPLETE

- [x] Add error types to AIService
- [x] Implement specific error throwing
- [x] Add error handling in Controller
- [x] Update frontend error handling
- [x] Test all error scenarios

### Phase 4: Suggested Prompts ✅ COMPLETE

- [x] Create SuggestedPrompts component
- [x] Define prompts for all roles
- [x] Add role detection logic
- [x] Integrate in chat UI
- [x] Test for all user types

### Phase 5: Feedback System ✅ COMPLETE

- [x] Create ChatFeedback model
- [x] Add feedback API endpoint
- [x] Create FeedbackButtons component
- [x] Integrate in chat messages
- [x] Test feedback storage

### Phase 6: Testing

- [ ] Test all user roles
- [ ] Test all languages
- [ ] Test conversation history
- [ ] Test error handling
- [ ] Test suggested prompts
- [ ] Test feedback mechanism

---

## Summary

### What We're Building

A comprehensive, intelligent chatbot that:

- Accesses all database data
- Supports 6 user types with authentication
- Responds in user's language automatically
- Maintains conversation context
- Handles errors gracefully
- Guides users with role-specific prompts
- Collects feedback for improvement

### Key Technical Decisions

1. **AI Language Detection**: Let LLM detect language (no manual logic)
2. **Conversation History**: Send last 5 messages with each request
3. **Authentication**: Session-based (NextAuth v5)
4. **Error Handling**: Specific error types with user-friendly messages
5. **Suggested Prompts**: Role-based, hardcoded (no AI generation)
6. **Feedback**: Simple thumbs up/down stored in MongoDB

### Success Criteria

✅ Chatbot answers queries using real database data  
✅ Responds in correct language (EN/AR/FR)  
✅ Different experience for each user role  
✅ Follow-up questions work correctly  
✅ Errors are user-friendly  
✅ Users can easily discover capabilities  
✅ Feedback is collected and stored

---

**Ready to begin implementation!** 🚀
