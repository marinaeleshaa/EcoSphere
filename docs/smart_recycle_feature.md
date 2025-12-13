# Smart Recycle Impact Feature Proposal

## Selected API: Climatiq API

**Source:** `docs/ecosphere_apis.md`

### Why Climatiq?

1.  **Comprehensive Data:** It has a dedicated verified database for "Waste Treatment" and "Material Use".
2.  **Free Tier:** It offers a generous developer free tier (typically up to 500-1000 requests/month) which is perfect for your requirements.
3.  **Relevance:** It fits perfectly with your existing `Recycle` feature (`src/backend/features/recycle`).

## Feature Description: "Eco-Impact Calculator"

### Concept

When a user submits a recycling request, the system will automatically calculate the **Carbon Footprint Saved** by recycling those items instead of sending them to a landfill.

### Workflow

1.  **User Action:** User submits a Recycle Request (Plastic, 5kg) via existing UI.
2.  **Backend Process:**
    - The `RecycleService` triggers a call to the **Climatiq API**.
    - Endpoint: `https://api.climatiq.io/data/v1/estimate`
    - Parameters: `emission_factor` (e.g., "waste_type_plastic_recycling"), `parameters` (weight: 5, unit: "kg").
3.  **Result:** The API returns the CO2e (Carbon Dioxide Equivalent) value.
4.  **Display:**
    - Show the user: "🌱 You just saved **12.5 kg** of CO2!"
    - Save this metric to the `Recycle` document in the database for leaderboard/stats.

## Implementation Plan

### 1. Backend Integration

- **File:** `src/backend/features/recycle/recycle.service.ts`
- **Action:** Add a method `calculateCarbonSaved(items: IRecycleItem[])`.
- **Helper:** Create a fast utility to map your `itemType` (e.g., "Plastic", "Glass") to Climatiq's _Emission Factor IDs_.

### 2. Data Enhancement

- **Model:** Update `RecycleModel` (`src/backend/features/recycle/recycle.model.ts`) to store `carbonSaved` (number).

### 3. Frontend Update

- **UI:** Display the "Carbon Saved" badge on the User Request history and the Success Screen.

## Future "True AI" Upgrade

While Climatiq provides the _data_, you can add "AI" by using a **Vision API** (like Gemini or OpenAI Vision) to allow users to **take a picture of their trash**, and the AI will auto-detect the `itemType` and estimated `weight` before sending it to Climatiq.
