# EcoSphere Recycling Feature - Complete Lifecycle Documentation

## Overview

The Recycling feature allows users to submit recyclable materials for tracking and environmental impact calculation. It supports two entry methods:

1. **Manual Entry**: Users manually input material types and quantities
2. **AI Vision**: Users upload images that are analyzed using computer vision to identify and count recyclable items

The system calculates carbon footprint savings, awards gamification points, and stores all entries in a database.

---

## Table of Contents

1. [Data Model](#data-model)
2. [Backend Architecture](#backend-architecture)
3. [API Routes](#api-routes)
4. [Frontend Components](#frontend-components)
5. [Complete User Flow](#complete-user-flow)
6. [Third-Party Integrations](#third-party-integrations)
7. [Gamification System](#gamification-system)

---

## Data Model

### IRecycle Interface

Located in: [`recycle.model.ts`](file:///e:/Graduation%20Project/EcoSphere/src/backend/features/recycle/recycle.model.ts)

```typescript
export interface IRecycle extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: IAddress;
  recycleItems: IRecycleItem[];
  totalCarbonSaved?: number;
  imageKeys?: string[];
  isVerified?: boolean;
  createdAt: Date; // from timestamps
  updatedAt: Date; // from timestamps
}
```

### IAddress Interface

```typescript
export interface IAddress {
  city: string;
  nighborhood?: string;
  street: string;
  buildingNumber: string;
  floor: number;
  apartmentNumber?: number;
}
```

### IRecycleItem Interface

```typescript
export interface IRecycleItem {
  itemType: string; // e.g., "Plastic", "Glass", "Metal"
  quantity: number; // Number of items
  weight: number; // Weight in kilograms
}
```

---

## Backend Architecture

### Layer 1: Repository

**File**: [`recycle.repository.ts`](file:///e:/Graduation%20Project/EcoSphere/src/backend/features/recycle/recycle.repository.ts)

**Responsibility**: Direct database operations using Mongoose

**Methods**:

- `createRecycleEntry(data)` - Creates new recycle entry in MongoDB
- `getRecycleEntryById(id)` - Fetches single entry by ID
- `updateRecycleEntry(id, data)` - Updates existing entry
- `deleteRecycleEntry(id)` - Deletes entry
- `listRecycleEntries()` - Lists all recycling entries

**Note**: Currently NO method exists to query by user email or userId. All entries are stored without user association.

---

### Layer 2: Service

**File**: [`recycle.service.ts`](file:///e:/Graduation%20Project/EcoSphere/src/backend/features/recycle/recycle.service.ts)

**Responsibility**: Business logic, AI integration, carbon calculation

**Key Methods**:

#### 1. `analyzeImages(files: Blob[])`

**Purpose**: Uses Roboflow AI to detect recyclable items in uploaded images

**Process**:

1. Converts each image to base64
2. Sends to Roboflow Workflow API with API key
3. Recursively searches response for prediction arrays
4. Counts detected objects by class (e.g., "plastic_bottle", "can")
5. **Redistribution Logic**: If unknown classes detected, adds their count to the dominant known class
6. Maps detected classes to material types using `WEIGHT_MAPPING`
7. Calculates total weight based on item counts × average weights
8. Calls `calculateCarbonFootprint()` for CO2e calculation

**Returns**:

```typescript
{
  items: [{
    originalLabel: "plastic_bottle",
    type: "Plastic",
    count: 5,
    estimatedWeight: 0.25  // 5 × 0.05kg
  }],
  totalEstimatedWeight: 0.25,
  estimatedCarbonSaved: 0.625  // from Climatiq API
}
```

**Weight Mapping**:

```typescript
const WEIGHT_MAPPING = {
  plastic_bottle: { type: "Plastic", weight: 0.05 }, // 50g per bottle
  bottle: { type: "Plastic", weight: 0.05 },
  can: { type: "Metal", weight: 0.015 }, // 15g per can
  glass_bottle: { type: "Glass", weight: 0.3 }, // 300g per bottle
  cardboard_box: { type: "Paper", weight: 0.2 }, // 200g per box
};
```

---

#### 2. `calculateManualCarbon(items)`

**Purpose**: Calculates carbon for manually entered materials

**Process**:

1. User provides `{ type: "Plastic", amount: 2.5 }` (amount = weight in kg)
2. Maps to internal format: `{ type: "Plastic", estimatedWeight: 2.5, count: 1 }`
3. Calls `calculateCarbonFootprint()` with formatted items
4. Returns total weight and carbon saved

---

#### 3. `calculateCarbonFootprint(items)`

**Purpose**: Calls Climatiq API to calculate CO2e (Carbon dioxide equivalent) savings

**Process**:

1. For each item, determines appropriate Climatiq emission factor config based on material type:

   - **Plastic**: Uses German Bafa plastics recycling factor
   - **Glass**: Uses EPA glass recycling factor
   - **Metal/Aluminum**: Uses EPA aluminum can recycling factor
   - **Paper/Cardboard**: Uses EPA mixed paper recycling factor
   - **Electronics**: Uses EPA mixed electronics recycling factor
   - **Default**: Uses EPA mixed recyclables factor

2. Makes POST request to `https://api.climatiq.io/data/v1/estimate`:

```typescript
{
  emission_factor: {
    activity_id: "plastics_rubber-type_plastics_recycled",
    source: "Bafa",
    region: "DE",
    year: 2025,
    source_lca_activity: "cradle_to_gate",
    data_version: "^29"
  },
  parameters: {
    weight: 2.5,
    weight_unit: "kg"
  }
}
```

3. Aggregates `co2e` values from all API responses
4. **Fallback**: If API fails, uses hardcoded factors:
   - Plastic: 2.5 kg CO2e per kg
   - Metal: 9.0 kg CO2e per kg
   - Glass: 0.6 kg CO2e per kg
   - Default: 1.0 kg CO2e per kg

**Returns**: Total CO2e in kilograms

---

### Layer 3: Controller

**File**: [`recycle.controller.ts`](file:///e:/Graduation%20Project/EcoSphere/src/backend/features/recycle/recycle.controller.ts)

**Responsibility**: Request handling, validation, dependency injection

**Methods**:

- `createRecycleEntry(fromData)` - Validates and creates entry
- `analyzeImages(formData)` - Extracts files and calls service
- `calculateManual(req)` - Parses JSON and calculates carbon
- CRUD operations: `getRecycleEntryById`, `updateRecycleEntry`, `deleteRecycleEntry`, `listRecycleEntries`

---

## API Routes

### 1. `/api/recycle/analyze` (POST)

**File**: [`analyze/route.ts`](file:///e:/Graduation%20Project/EcoSphere/src/app/api/recycle/analyze/route.ts)

**Purpose**: Analyze uploaded images using AI

**Request**: `FormData` with `files` field containing image(s)

**Response**:

```json
{
  "items": [
    {
      "originalLabel": "plastic_bottle",
      "type": "Plastic",
      "count": 3,
      "estimatedWeight": 0.15
    }
  ],
  "totalEstimatedWeight": 0.15,
  "estimatedCarbonSaved": 0.375
}
```

**Error Response**:

```json
{
  "error": "No files uploaded"
}
```

---

### 2. `/api/recycle/calculate` (POST)

**File**: [`calculate/route.ts`](file:///e:/Graduation%20Project/EcoSphere/src/app/api/recycle/calculate/route.ts)

**Purpose**: Calculate carbon for manually entered materials

**Request Body**:

```json
{
  "items": [
    { "type": "Plastic", "amount": 2.5 },
    { "type": "Metal", "amount": 1.0 }
  ]
}
```

**Response**:

```json
{
  "items": [
    { "type": "Plastic", "estimatedWeight": 2.5, "count": 1 },
    { "type": "Metal", "estimatedWeight": 1.0, "count": 1 }
  ],
  "totalEstimatedWeight": 3.5,
  "estimatedCarbonSaved": 15.25
}
```

---

### 3. `/api/recycle` (POST)

**Location**: (Not shown in code, but implied to exist)

**Purpose**: Create final recycling entry in database

**Request Body**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "+20123456789",
  "address": {
    "city": "Cairo",
    "street": "Main St",
    "buildingNumber": "10",
    "floor": 3
  },
  "items": [...],  // From analyze or calculate
  "totalCarbonSaved": 15.25,
  "isVerified": true
}
```

**Response**: Created `IRecycle` document

---

## Frontend Components

### 1. RecycleForm Component

**File**: [`recycleForm.tsx`](file:///e:/Graduation%20Project/EcoSphere/src/components/layout/Recycle/recycleForm.tsx)

**Purpose**: Main form for recycling submissions

**Features**:

- Personal info section (name, email, phone)
- Address section (city, street, building, floor)
- Entry method toggle: Manual vs AI Vision
- Material section for manual entry
- Image upload area for AI vision
- One-shot submit button

**State Management**:

```typescript
const [materials, setMaterials] = useState<MaterialItem[]>([
  { id: 1, type: "", amount: 1 },
]);
const [entryMethod, setEntryMethod] = useState<"manual" | "vision">("manual");
const [imageFiles, setImageFiles] = useState<File[]>([]);
```

**Submission Flow** (Line 72-154):

1. **Manual Mode**:

   - Validates at least one material with type selected
   - Calls `/api/recycle/calculate` with materials array
   - Receives carbon calculation result

2. **Vision Mode**:

   - Validates at least one image uploaded
   - Calls `analyzeImages()` hook function (uploads to `/api/recycle/analyze`)
   - Receives detected items and carbon calculation

3. **Final Submission**:
   - Creates payload with form data + calculated items + carbon saved
   - POSTs to `/api/recycle` to save entry
   - **Gamification**: Calculates points = `Math.round(carbonSaved × 100)`
   - Calls `updateUserPoints(pointsEarned)` to award points
   - Shows success toast with carbon saved and points earned
   - Resets form to initial state

---

### 2. useRecycleAnalysis Hook

**File**: [`useRecycleAnalysis.ts`](file:///e:/Graduation%20Project/EcoSphere/src/hooks/useRecycleAnalysis.ts)

**Purpose**: Custom React hook for image analysis

**Methods**:

- `analyzeImages(files)` - Uploads files to API, returns analysis result
- `clearResult()` - Resets state

**State**:

- `isAnalyzing` - Loading state during API call
- `result` - Analysis result from API
- `error` - Error message if analysis fails

**Usage**:

```typescript
const { analyzeImages, isAnalyzing, error } = useRecycleAnalysis();

const data = await analyzeImages(imageFiles);
if (!data) return; // Error handled in hook
// Use data.items, data.estimatedCarbonSaved
```

---

## Complete User Flow

### Manual Entry Flow

```
1. User fills personal info
   ↓
2. User selects "Manual" entry method
   ↓
3. User adds materials:
   - Type: "Plastic"
   - Amount: 2.5 kg
   ↓
4. User clicks "Submit"
   ↓
5. Frontend sends POST /api/recycle/calculate
   Body: { items: [{ type: "Plastic", amount: 2.5 }] }
   ↓
6. Backend calculates carbon using Climatiq API
   ↓
7. Backend returns:
   {
     items: [{ type: "Plastic", estimatedWeight: 2.5 }],
     totalEstimatedWeight: 2.5,
     estimatedCarbonSaved: 6.25
   }
   ↓
8. Frontend submits final entry POST /api/recycle
   Body: {
     ...personalInfo,
     items: [...],
     totalCarbonSaved: 6.25,
     isVerified: true
   }
   ↓
9. Backend saves to MongoDB
   ↓
10. Frontend calculates points: 6.25 × 100 = 625 points
    ↓
11. Frontend calls updateUserPoints(625)
    ↓
12. Success toast: "You saved 6.25 kg CO2e and earned 625 points!"
    ↓
13. Form resets
```

---

### AI Vision Flow

```
1. User fills personal info
   ↓
2. User selects "AI Scan" entry method
   ↓
3. User uploads 2 images (bottles.jpg, cans.jpg)
   ↓
4. User clicks "Submit"
   ↓
5. Frontend sends POST /api/recycle/analyze
   Body: FormData with 2 image files
   ↓
6. Backend converts images to base64
   ↓
7. Backend calls Roboflow Workflow API:
   POST ${ROBOFLOW_WORKFLOW_URL}
   Body: {
     api_key: ${ROBOFLOW_API_KEY},
     inputs: { image: { type: "base64", value: "..." } }
   }
   ↓
8. Roboflow returns predictions:
   [
     { class: "plastic_bottle", ... },
     { class: "plastic_bottle", ... },
     { class: "can", ... }
   ]
   ↓
9. Backend counts: { plastic_bottle: 2, can: 1 }
   ↓
10. Backend maps to weights:
    plastic_bottle × 2 = 0.1 kg
    can × 1 = 0.015 kg
    Total: 0.115 kg
    ↓
11. Backend calls Climatiq API for carbon calculation
    ↓
12. Backend returns:
    {
      items: [
        { type: "Plastic", count: 2, estimatedWeight: 0.1 },
        { type: "Metal", count: 1, estimatedWeight: 0.015 }
      ],
      totalEstimatedWeight: 0.115,
      estimatedCarbonSaved: 0.29
    }
    ↓
13. Frontend submits final entry POST /api/recycle
    ↓
14. Backend saves to MongoDB
    ↓
15. Frontend awards points: 0.29 × 100 = 29 points
    ↓
16. Success and form reset
```

---

## Third-Party Integrations

### 1. Roboflow Computer Vision

**Purpose**: Detect and classify recyclable items in images

**API Endpoint**: `${process.env.ROBOFLOW_WORKFLOW_URL}`

**Authentication**: `${process.env.ROBOFLOW_API_KEY}`

**Request Format**:

```json
{
  "api_key": "YOUR_API_KEY",
  "inputs": {
    "image": {
      "type": "base64",
      "value": "iVBORw0KGgoAAAANSUhEUgAA..."
    }
  }
}
```

**Response**: Variable structure, recursively searched for prediction arrays

**Detected Classes** (based on WEIGHT_MAPPING):

- `plastic_bottle`
- `bottle` (generic)
- `can`
- `glass_bottle`
- `cardboard_box`

**Special Handling**:

- Unknown classes are redistributed to the dominant known class
- Counts are aggregated across multiple images

---

### 2. Climatiq Carbon API

**Purpose**: Calculate CO2 equivalent savings from recycling

**API Endpoint**: `https://api.climatiq.io/data/v1/estimate`

**Authentication**: `Bearer ${process.env.CLIMATIQ_API_KEY}`

**Emission Factors Used**:

| Material        | Activity ID                                               | Source | Region |
| --------------- | --------------------------------------------------------- | ------ | ------ |
| Plastic         | `plastics_rubber-type_plastics_recycled`                  | Bafa   | DE     |
| Glass           | `waste-type_glass-disposal_method_recycled`               | EPA    | US     |
| Metal/Aluminum  | `waste-type_aluminum_cans-disposal_method_recycled`       | EPA    | US     |
| Paper/Cardboard | `waste-type_mixed_paper_general-disposal_method_recycled` | EPA    | US     |
| Electronics     | `waste-type_mixed_electronics-disposal_method_recycled`   | EPA    | US     |
| Mixed (default) | `waste-type_mixed_recyclables-disposal_method_recycled`   | EPA    | US     |

**Request Example**:

```json
{
  "emission_factor": {
    "activity_id": "plastics_rubber-type_plastics_recycled",
    "source": "Bafa",
    "region": "DE",
    "year": 2025,
    "source_lca_activity": "cradle_to_gate",
    "data_version": "^29",
    "allowed_data_quality_flags": ["notable_methodological_variance"]
  },
  "parameters": {
    "weight": 2.5,
    "weight_unit": "kg"
  }
}
```

**Response Example**:

```json
{
  "co2e": 6.25,
  "co2e_unit": "kg",
  "co2e_calculation_method": "ar5",
  "emission_factor": {...}
}
```

---

## Gamification System

### Points Calculation

**Formula**: `points = Math.round(carbonSaved × 100)`

**Examples**:

- 1.5 kg CO2e saved → 150 points
- 0.29 kg CO2e saved → 29 points
- 10 kg CO2e saved → 1000 points

### Points Award Flow

1. After successful recycling entry creation
2. Frontend calculates points from `estimatedCarbonSaved`
3. Calls `updateUserPoints(pointsEarned)` API
4. Backend adds points to user's account
5. Points can be redeemed for discount coupons (separate feature)

### Success Toast

Shows:

- Carbon saved in kg CO2e
- Points earned
- Encouraging message

Example: _"You saved 6.25 kg CO2e and earned 625 points!"_

---

## Environment Variables Required

```env
# Roboflow AI
ROBOFLOW_WORKFLOW_URL=https://detect.roboflow.com/...
ROBOFLOW_API_KEY=your_roboflow_api_key

# Climatiq Carbon API
CLIMATIQ_API_KEY=your_climatiq_api_key
```

---

## Current Limitations & Potential Improvements

### Limitations

1. **No User Association**: Recycling entries are not linked to user accounts (no `userId` field)
2. **No Image Storage**: Uploaded images are analyzed but not persisted (only `imageKeys` field exists, not used)
3. **Limited Weight Mapping**: Only 5 material classes have predefined weights
4. **No Validation**: Roboflow predictions aren't validated for accuracy
5. **Global Recycling List**: `listRecycleEntries()` returns ALL entries, not user-specific

### Potential Improvements

1. **Add User Linking**: Add `userId` field to schema, filter entries by user
2. **Store Images**: Upload images to S3, store keys in `imageKeys[]`
3. **Expand Weight Mapping**: Add more material types (paper, textiles, batteries)
4. **Confidence Thresholds**: Only accept Roboflow predictions above 70% confidence
5. **User Dashboard**: Show user's recycling history and total environmental impact
6. **Verification System**: Admin panel to verify user submissions (use `isVerified` field)
7. **Rewards Catalog**: Use earned points to unlock eco-friendly products/discounts

---

## File Structure Summary

```
src/
├── backend/features/recycle/
│   ├── recycle.model.ts        # Mongoose schema & interfaces
│   ├── recycle.repository.ts   # Database operations
│   ├── recycle.service.ts      # Business logic, AI, carbon calc
│   ├── recycle.controller.ts   # Request handlers
│   ├── recycle.types.ts        # Type definitions
│   └── recycle.dto.ts          # Data transfer objects
│
├── app/api/recycle/
│   ├── analyze/route.ts        # POST - AI image analysis
│   └── calculate/route.ts      # POST - Manual carbon calc
│
├── components/layout/Recycle/
│   ├── recycleForm.tsx         # Main recycling form
│   ├── PersonalInfoSection.tsx # Name, email, phone inputs
│   ├── AddressSection.tsx      # Address form fields
│   ├── MaterialSection.tsx     # Manual material entry
│   └── VisionUploadArea.tsx    # Image upload component
│
└── hooks/
    └── useRecycleAnalysis.ts   # Custom hook for AI analysis
```

---

## Testing the Feature

### Manual Testing Steps

1. Navigate to recycling page
2. Fill personal information
3. **Test Manual Entry**:
   - Select "Manual" mode
   - Add material: Plastic, 2.5 kg
   - Submit
   - Verify carbon calculation shown
   - Check points awarded
   - Verify database entry
4. **Test AI Vision**:

   - Select "AI Scan" mode
   - Upload image with bottles/cans
   - Submit
   - Verify Roboflow detection works
   - Check carbon calculation
   - Verify points awarded

5. **Edge Cases**:
   - Submit with no materials (should error)
   - Upload non-image file (should error)
   - Test with very large images
   - Test with 10+ images

---

**Documentation Generated**: 2025-12-21  
**Feature Version**: 1.0  
**Last Updated By**: Team Analysis
