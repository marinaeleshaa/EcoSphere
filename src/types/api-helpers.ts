import { NextResponse } from "next/server";
import type {
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
} from "./api.types";

/**
 * Helper functions to create typed API responses
 */

/**
 * Creates a successful API response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status }
  );
}

/**
 * Creates an error API response
 */
export function createErrorResponse(
  error: string,
  message?: string,
  status: number = 500
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(message && { message }),
      statusCode: status,
    },
    { status }
  );
}

/**
 * Wraps a controller result in a typed API response
 * Handles null/undefined results as errors
 */
export function handleControllerResponse<T>(
  result: T | null | undefined,
  successMessage?: string,
  errorMessage: string = "Operation failed",
  errorStatus: number = 404
): NextResponse<ApiResponse<T>> {
  if (result === null || result === undefined) {
    return createErrorResponse(errorMessage, errorMessage, errorStatus);
  }
  return createSuccessResponse(result, successMessage);
}

/**
 * Wraps async operations with error handling
 */
export async function handleApiRequest<T>(
  handler: () => Promise<T>,
  errorStatus: number = 500
): Promise<NextResponse<ApiResponse<T>>> {
  try {
    const result = await handler();
    return createSuccessResponse(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return createErrorResponse(errorMessage, errorMessage, errorStatus);
  }
}

/**
 * Handles caught errors and returns a typed error response
 */
export function handleError(
  error: unknown,
  status: number = 500
): NextResponse<ApiErrorResponse> {
  const errorMessage =
    error instanceof Error ? error.message : String(error);
  return createErrorResponse(errorMessage, errorMessage, status);
}

/* optional improvement simpler and more readable
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
utils/http-response.ts
export const ok = <T>(data: T) =>
  Response.json({ success: true, data }, { status: 200 });

export const created = <T>(data: T) =>
  Response.json({ success: true, data }, { status: 201 });

export const badRequest = (message: string) =>
  Response.json({ success: false, error: message }, { status: 400 });

and than we can use it like 
export async function POST(req: Request) {
  const body = await req.json();
  if (!body.name) return badRequest("Missing name");
  const user = await userService.create(body);
  return ok(user);
}
  */
