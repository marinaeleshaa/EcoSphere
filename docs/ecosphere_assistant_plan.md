# EcoSphere Assistant Implementation Plan

## Overview

The **EcoSphere Assistant** is a floating chat widget available on the website. It uses **Google Gemini (Text)** to answer user questions about recycling, sustainability, and product details.

**Key Features:**

1.  **Floating Widget:** unobtrusive chat button in the bottom-right corner.
2.  **Context-Aware:** It knows it is the "EcoSphere Assistant".
3.  **Local Knowledge:** It can be fed context about the current page (e.g., if a user is viewing a Product, the AI knows the product details).

---

## 1. Architecture Flow

1.  **User Interface:** User clicks the "Leaf Icon" -> Chat Window opens.
2.  **Interaction:** User types: _"Is this bottle recyclable?"_
3.  **Frontend Logic:**
    - Captures user message.
    - (Optional) Captures "Current Page Context" (e.g., product name/ID).
    - Sends `POST /api/ai/chat` with `{ message, context }`.
4.  **Backend Logic (`/api/ai/chat`):**
    - **Context Retrieval:** AI Controller calls `aiRepository.getContext(contextType, contextId)`.
    - **Prompt Construction:** Service builds prompt with: _"User is viewing Product: {product_title}..."_
    - **Generation:** Calls **Google Gemini API**.
5.  **Response:** Backend returns the text answer. Frontend displays it.

---

## 2. API & External Services

**Existing Keys:** `GOOGLE_GEMINI_API_KEY` (Already in `.env`).

---

## 3. Backend Implementation Details

### A. New Controller & Route

**File:** `src/backend/features/ai/ai.controller.ts`

- **Method:** `chatWithAssistant(req: Request)`
- **Logic:**
  1.  Extract `context` object from request (e.g., `{ type: 'product', id: '123' }`).
  2.  Call `aiService.generateResponse(message, context)`.

### B. New Repository (Data Access Layer)

**File:** `src/backend/features/ai/ai.repository.ts`

- **Purpose:** The AI needs "ground truth" data to minimize hallucinations.
- **Dependencies:** Injects `ProductRepository`, `RestaurantRepository`.
- **Methods:**
  - `getProductContext(id: string)`: Fetches product title, materials, eco-score.
  - `getRestaurantContext(id: string)`: Fetches restaurant name, description, and **full menu**.
  - `getGeneralContext()`: Fetches global site rules (optional).

### C. AI Service

**File:** `src/backend/features/ai/ai.service.ts`

- **Method:** `generateResponse(userMessage: string, context?: { type, id })`
- **Logic:**
  1.  **Switch Context:**
      - `if (type === 'product')` -> `aiRepo.getProductContext(id)`
      - `if (type === 'restaurant')` -> `aiRepo.getRestaurantContext(id)`
  2.  Construct System Prompt:
      ```text
      Role: EcoSphere Assistant.
      Current Context: {context_data_string}
      Question: {userMessage}
      ```
  3.  Call Gemini API.

### D. Context Strategy Map

We do **NOT** need a database model for every page. We use a hybrid approach:

1.  **Static Pages (Home, About, Contact):**
    - Hardcoded simple strings in the Service/Repository.
    - _Example:_ `if (type === 'home') return "You are on the homepage. Highlight our top 3 features..."`
2.  **Functional Pages (Recycle, Cart):**
    - Hardcoded rules + User Session Data.
    - _Example:_ `if (type === 'cart') return "User has ${cartItemCount} items. Remind them about carbon offsets."`
3.  **Dynamic Pages (Product, Restaurant):**
    - **Fetch from DB.**
    - _Product:_ Returns Title + Price + Description.
    - _Restaurant:_ Returns Name + Location + **Full Menu List**.

---

## 4. Frontend Implementation Details

### A. Global Chat Component

**File:** `src/components/assistant/EcoAssistant.tsx` (New Component)

- **State:** `isOpen` (boolean), `messages` (array of `{role, text}`).
- **UI:**
  - **Trigger Button:** Fixed position (bottom-4, right-4).
  - **Chat Window:** Absolute position, styled with Tailwind (Glassmorphism).
  - **Input Field:** Text area + Send button.
- **Global Layout:** Add `<EcoAssistant />` to `src/app/[locale]/layout.tsx` so it appears on **all pages**.

### B. "Page Context" Hook (Advanced)

- **Hook:** `usePageContext()`
- **Usage:** If the user is on `/products/123`, the component grabs the product title/description from the DOM or State and sends it as a hidden "Context" param to the AI. _"The user is looking at 'Bamboo Straws'. Answer their question in this context."_

---

## 5. Execution Steps

1.  **Backend:** Create `src/backend/features/ai` folder (service, controller, route).
2.  **API:** Implement the `POST /api/ai/chat` endpoint connecting to Gemini.
3.  **Frontend:** Build the `EcoAssistant` UI component.
4.  **Integration:** Connect Frontend to Backend.
5.  **Integration:** Mount the component in the Root Layout.
