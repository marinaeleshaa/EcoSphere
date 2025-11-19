# API Response Types Usage Guide

This guide explains how to use the typed API response system in your Next.js backend.

## Overview

All API routes now return typed responses with a consistent structure:
- **Success responses**: `{ success: true, data: T, message?: string }`
- **Error responses**: `{ success: false, error: string, message?: string, statusCode?: number }`

## Type Definitions

### Base Types (`src/types/api.types.ts`)

```typescript
// Generic success response
type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

// Generic error response
type ApiErrorResponse = {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
};

// Union type for all responses
type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

### Specific Response Types

- `LoginResponse` - Response from `/api/login`
- `SignupResponse` - Response from `/api/signup`
- `UserResponse` - Response from `/api/users/[id]`
- `UsersResponse` - Response from `/api/users`

## Using Types in API Routes

### Example 1: Simple GET Route

```typescript
import { NextRequest } from "next/server";
import { handleApiRequest } from "@/types/api-helpers";
import type { UsersResponse } from "@/types/api.types";

export const GET = async (
  _req: NextRequest
): Promise<UsersResponse> => {
  return handleApiRequest(async () => {
    const controller = rootContainer.resolve(UserController);
    const result = await controller.getAll();
    return result; // Returns User[]
  });
};
```

### Example 2: Route with Null Handling

```typescript
import { NextRequest } from "next/server";
import { handleControllerResponse } from "@/types/api-helpers";
import type { UserResponse } from "@/types/api.types";

export const GET = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<UserResponse> => {
  const { id } = await context.params;
  try {
    const controller = rootContainer.resolve(UserController);
    const result = await controller.getById(id);
    return handleControllerResponse(
      result, // Can be User | null
      "User retrieved successfully", // Success message
      "User not found", // Error message if null
      404 // Error status code
    );
  } catch (error) {
    return handleApiRequest(
      async () => {
        throw error;
      },
      500
    );
  }
};
```

### Example 3: POST Route with Validation

```typescript
import { NextRequest } from "next/server";
import { 
  handleControllerResponse, 
  createErrorResponse 
} from "@/types/api-helpers";
import type { LoginResponse } from "@/types/api.types";

export const POST = async (
  request: NextRequest
): Promise<LoginResponse> => {
  const body = await request.json();
  
  // Validation
  if (!body.email || !body.password) {
    return createErrorResponse(
      "Email and password are required",
      "Email and password are required",
      400
    );
  }

  try {
    const controller = rootContainer.resolve(AuthController);
    const result = await controller.LogIn(body);
    return handleControllerResponse(
      result,
      "Login successful",
      "Either email or password is incorrect",
      401
    );
  } catch (error) {
    return handleApiRequest(
      async () => {
        throw error;
      },
      500
    );
  }
};
```

## Helper Functions

### `createSuccessResponse<T>(data, message?, status?)`
Creates a successful API response.

```typescript
createSuccessResponse(user, "User created", 201);
// Returns: NextResponse<ApiSuccessResponse<User>>
```

### `createErrorResponse(error, message?, status?)`
Creates an error API response.

```typescript
createErrorResponse("User not found", "User not found", 404);
// Returns: NextResponse<ApiErrorResponse>
```

### `handleControllerResponse<T>(result, successMessage?, errorMessage?, errorStatus?)`
Handles controller results that may be null/undefined.

```typescript
handleControllerResponse(
  user, // T | null | undefined
  "User found", // Success message
  "User not found", // Error message
  404 // Error status
);
```

### `handleApiRequest<T>(handler, errorStatus?)`
Wraps async operations with try-catch error handling.

```typescript
handleApiRequest(async () => {
  const result = await someAsyncOperation();
  return result;
}, 500);
```

### Type Guards

```typescript
import { isApiSuccess, isApiError } from "@/types/api.types";

const response: ApiResponse<User> = await fetch(...).then(r => r.json());

if (isApiSuccess(response)) {
  // TypeScript knows response.data exists
  console.log(response.data);
}

if (isApiError(response)) {
  // TypeScript knows response.error exists
  console.log(response.error);
}
```

## Using Types on the Frontend

### Example: Fetching Users

```typescript
import type { UsersResponse, isApiSuccess } from "@/types/api.types";

async function fetchUsers() {
  const response = await fetch("/api/users");
  const data: UsersResponse = await response.json();
  
  if (isApiSuccess(data)) {
    // TypeScript knows data.data is User[]
    console.log(data.data);
    return data.data;
  } else {
    // TypeScript knows data.error exists
    console.error(data.error);
    throw new Error(data.error);
  }
}
```

### Example: Login

```typescript
import type { LoginResponse, AuthTokenResponse } from "@/types/api.types";
import { isApiSuccess } from "@/types/api.types";

async function login(email: string, password: string) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  const data: LoginResponse = await response.json();
  
  if (isApiSuccess(data)) {
    // TypeScript knows data.data is AuthTokenResponse
    const { token, user } = data.data;
    localStorage.setItem("token", token);
    return user;
  } else {
    throw new Error(data.error);
  }
}
```

## Benefits

1. **Type Safety**: All API responses are typed, preventing runtime errors
2. **Consistency**: All endpoints follow the same response structure
3. **IntelliSense**: Full autocomplete support in your IDE
4. **Error Handling**: Standardized error response format
5. **Maintainability**: Easy to update response types across the codebase

## Adding New Response Types

When creating a new endpoint, add its response type to `src/types/api.types.ts`:

```typescript
// For a new products endpoint
export type ProductResponse = ApiResponse<Product>;
export type ProductsResponse = ApiResponse<Product[]>;
```

Then use it in your route:

```typescript
import type { ProductsResponse } from "@/types/api.types";

export const GET = async (): Promise<ProductsResponse> => {
  // ...
};
```

