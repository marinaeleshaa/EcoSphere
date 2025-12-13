# Vision Bulk Recycling Implementation Plan

## Overview

This feature allows users to **drag and drop** multiple images of recyclable waste (e.g., a bag of plastic bottles, a stack of cardboard). The system will use **Roboflow Inference API** to analyze the images, count the items, estimate their weight using a custom mapping, and then use **Climatiq** to calculate the potential carbon savings.

## 1. Architecture Flow (Optimized for Roboflow)

1.  **Step 1: AI Analysis (Roboflow Vision)**
    - **User** uploads images to frontend.
    - **Backend** (`/api/recycle/analyze`) sends images to **Roboflow Inference API**.
    - **Roboflow** returns a list of detected objects (e.g., `{ class: 'plastic-bottle', confidence: 0.9 }`).
    - **Backend** aggregates counts and calls `WeightService` to estimate total weight (e.g., 10 bottles \* 0.05kg = 0.5kg).
    - **Backend** returns this "Draft List" to the frontend.
2.  **Step 2: User Validation**
    - **User** sees the "Draft List" in an editable table.
    - **User** corrects any mistakes (e.g., changes "10kg" to "2kg").
    - **User** clicks "Confirm & Submit".
3.  **Step 3: Carbon Calculation & Save**
    - **Backend** (`/api/recycle/create`) receives the _validated_ list.
    - **Backend** calls **Climatiq API** with the correct data to calculate CO2.
    - **Backend** saves the Entry + CO2 Stats to the database.
4.  **Step 4: Reward Points**
    - **Backend** calculates points: `Points = Total_CO2_Saved_kg * 10`.
    - **Backend** updates user's `points` in `UserModel`.
    - **Frontend** shows: "Success! You saved 5kg CO2 and earned **50 Eco-Points**!"

_Benefit: We only call the persistent/carbon API once we are sure the data is correct._

## 2. API & External Services

You will need to set up the following keys in your `.env` file:

```env
ROBOFLOW_API_KEY=your_key_here
ROBOFLOW_MODEL_ID=your_model_id (e.g., 'recycling-dataset/3')
CLIMATIQ_API_KEY=your_key_here
```

## 3. Backend Implementation Details

### A. New Controller Method (Analysis Only)

**File:** `src/backend/features/recycle/recycle.controller.ts`

- **Method:** `analyzeImages(req: Request)`
- **Action:**
  1.  Receives image files.
  2.  Calls **Gemini** to detect recyclables.
  3.  **Returns:** JSON `{ items: [ { type: 'Plastic', weight: 5, ... } ] }`.
  - _Note: Does NOT call Climatiq._

### B. Updated Create Method (Calculation)

**File:** `src/backend/features/recycle/recycle.controller.ts` (and Service)

- **Method:** `createRecycleEntry` (Existing)
- **Update:**
  1.  Before saving, take the incoming `recycleItems` list.
  2.  Call `recycleService.calculateCarbonFootprint(items)`.
  3.  Add the result to the document.
  4.  Save to DB.

5.  **Bonus:** Calculate Points (`CO2 * 10`) and update `User.points`.

### C. AI Service Integration

**File:** `src/backend/features/recycle/recycle.service.ts`

- **Method:** `detectRecyclablesWithRoboflow(imageBuffer: Buffer)`
- **Logic:** POST request to Roboflow Inference API.
- **Mapping:**
  - Detect `bottle` -> Map to `Plastic`.
  - Detect `can` -> Map to `Metal`.
  - Calculate Weight: `Count * AvgWeight` (e.g., 1 can = 0.015kg).

### D. Carbon Service Integration (Climatiq)

**File:** `src/backend/features/recycle/recycle.service.ts`

- **Method:** `calculateCarbonFootprint(items: IRecycleItem[])`
- **Logic:**
  1.  Map local `itemType` to Climatiq `emission_factor_id`.
  2.  Return total `co2e`.

### E. Image Storage Strategy

**Service:** Reuse `src/backend/services/image.service.ts`

- **Step 3 (Final Save):** When the user confirms the list, they also submit the images (or referencing IDs if uploaded earlier).
- **Process:**
  1.  Passed images are uploaded to S3 using `imageService.uploadImage`.
  2.  The returned S3 `key` is stored in the MongoDB `Recycle` document.
- **Why:** Cloud storage is for files; Database is for metadata (User ID, Carbon stats, etc.).

## 4. Frontend Implementation Details

### A. UI Components

- **Upload Zone:** A dashed-border box supporting drag-and-drop.
- **Analysis Loader:** "🤖 AI is analyzing your trash..." (Animation).
- **Results Table:** A clean table showing:
  - Image Thumbnail
  - Detected Type (Dropdown to fix)
  - Est. Weight (Input to fix)
  - CO2 Saved (Badge)
  - Action (Delete row)

### B. New Page

- `src/app/[locale]/recycle/scan/page.tsx`: The dedicated page for this "Smart" flow.

## 5. Data Model Updates

**File:** `src/backend/features/recycle/recycle.model.ts`

- Update `IRecycleItem` to optionally include `co2Saved` (number).
- Update `IRecycle` to include:
  - `totalCarbonSaved` (number)
  - `imageKeys` (string[]) -> Array of S3 Object Keys

## 6. Execution Steps

1.  **Setup Keys:** Get API keys for Gemini and Climatiq.
2.  **Backend Logic:** Implement the `analyze` endpoint and AI/Carbon service logic.
3.  **Frontend UI:** Build the Drag-and-Drop zone and the Review Table.
4.  **Integration:** Connect the Frontend to the new Backend endpoint.
5.  **Testing:** Test with real images of bottles/cans to tune the system prompt.
