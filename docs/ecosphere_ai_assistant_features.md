# EcoSphere AI Assistant Features

## Overview

The EcoSphere AI Assistant is a fully integrated, context-aware, and multilingual support agent designed to help users navigate the marketplace, find sustainable products, and locate recycling centers. It is powerd by the **Llama 3** model (via Hugging Face) and grounded in the application's real-time database.

---

## 1. Core AI Engine

- **Model**: `meta-llama/Meta-Llama-3-8B-Instruct`.
- **API**: Hugging Face Inference API (OpenAI-compatible endpoint).
- **Behavior**:
  - **Persona**: Helpful, encouraging, and "green" (uses emojis like 🌱, ♻️).
  - **Conciseness**: Constrained to short, digestible answers (under 3 sentences).
  - **Safety**: Disclaimer included ("AI can make mistakes").

## 2. Advanced Context Awareness

The AI "knows" exactly where the user is and what is available in the database.

### A. Page Awareness

The assistant detects the current URL route and adapts its knowledge:

- **Home**: General mission and navigation.
- **Recycle**: Explains how to find centers and what materials are accepted.
- **Shop/Store**: Assists with filtering and product discovery.
- **Auth/Profile**: Guides users on account management.

### B. Entity Awareness

When visiting a specific item page, the AI automatically reads the details:

- **Product Page**: Knows the price, rating, description, and seller.
- **Restaurant Page**: Knows the menu, working hours, and location.

### C. Dynamic Global Knowledge

- **Real-Time Data**: The AI reads a live snapshot of the database on every request.
- **Anti-Hallucination**: It only lists restaurants and products that _actually exist_ in your database.
- **Top Picks**: Automatically identifies and recommends the top 5 highest-rated products.

## 3. Smart Linking & Navigation

- **Clickable Output**: The AI generates internal Markdown links for entities it recognizes.
- **Hidden IDs**: Reference IDs (e.g., MongoDB `_id`) are used in the link URL but **hidden** from the visible text for a clean user experience.
  - _Example_: "Check out [GreenBites](/shop/654...)" instead of "GreenBites (ID: 654...)".
- **Visual Styling**: Links are styled in **Blue** and **Underlined** to be clearly interactive.

## 4. Globalization & Localization

- **Multilingual Support**: Fully supports **English**, **Arabic**, and **French**.
- **Auto-Detection**: The backend detects the user's current locale (`/en`, `/ar`, `/fr`) and instructs the AI to reply in that language.
- **UI Translation**: All interface elements (buttons, headers, error messages) are translated using `next-intl` (keys stored in `messages/*.json`).

## 5. Frontend Experience

- **Global Widget**: Accessible from anywhere in the app (in `layout.tsx`).
- **Components**:
  - `AIChatButton`: Floating action button with "Sparkle" animations.
  - `AIChatWindow`: Modern, glass-morphism inspired chat interface.
  - `ThinkingIndicator`: Animated dots to show the AI is processing.
- **Design System**: Fully styled using the project's **Global CSS** variables (`--primary`, `--card`, `--muted`) to perfectly match the EcoSphere theme in both Light and Dark modes.

## 6. Technical Stack

- **Frontend**: Next.js (App Router), Tailwind CSS, Framer Motion (animations), React Markdown.
- **Backend**: Next.js API Routes, Mongoose (MongoDB), Tsyringe (Dependency Injection).
- **State Management**: Custom `useAIChat` hook.
