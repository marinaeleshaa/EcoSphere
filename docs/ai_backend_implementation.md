# AI Feature Backend Implementation

This document details the backend implementation of the **EcoSphere Assistant** (Chat feature).

## 1. Architecture Overview

The feature follows the project's **Dependency Injection** pattern using `tsyringe`.

- **Route:** `/api/ai/chat` (Next.js App Router)
- **Controller:** `AIController` (Handles Request/Response)
- **Service:** `AIService` (Talks to Gemini API)
- **Repository:** `AIRepository` (Fetches Data from DB)

---

## 2. Key Components

### A. Data Access Layer (`AIRepository`)

**Location:** `src/backend/features/ai/ai.repository.ts`

This class acts as an aggregator. It connects to other repositories (`ProductRepository`, `RestaurantRepository`) to fetch "Ground Truth" data and returns it as structured **JSON**.

```typescript
// Example Return Structure
{
  title: "Bamboo Toothbrush",
  price: 5.99,
  soldBy: "EcoShop",
  availableOnline: true
}
```

### B. Business Logic Layer (`AIService`)

**Location:** `src/backend/features/ai/ai.service.ts`

This service is responsible for:

1.  **Context Assembly:** It takes the JSON from the repository and bundles it with a "General Context" (System definition).
2.  **Prompt Engineering:** It injects the JSON into a hidden System Prompt:
    > "Knowledge Base: Use the provided JSON context to answer questions."
3.  **API Call:** It sends the prompt to **Google Gemini (`gemini-1.5-flash`)** via a standard HTTP `fetch`.

### C. Controller Layer (`AIController`)

**Location:** `src/backend/features/ai/ai.controller.ts`

Standard controller that:

1.  Validates the `message` exists.
2.  Extracts the `context` param (e.g., `{ type: 'product', id: '123' }`).
3.  Returns `{ answer: string }` or an error.

---

## 3. Dependency Injection Configuration

**Location:** `src/backend/config/container.ts`

The new components are registered as singletons to be accessible throughout the app:

```typescript
container.registerSingleton("AIRepository", AIRepository);
container.registerSingleton("AIService", AIService);
```

---

## 4. API Specification

**Endpoint:** `POST /api/ai/chat`

**Request Body:**

```json
{
  "message": "Is this recyclable?",
  "context": {
    "type": "product",
    "id": "67531b..."
  }
}
```

**Response Body:**

```json
{
  "answer": "Yes, this Bamboo Toothbrush is biodegradable..."
}
```
