import { User } from "@/generated/prisma/client";

/**
 * Base API Response Types
 * These provide a consistent structure for all API responses
 */

/**
 * Generic success response wrapper
 */
export type ApiSuccessResponse<T = unknown> = {
  success: true;
  data: T;
  message?: string;
};

/**
 * Generic error response wrapper
 */
export type ApiErrorResponse = {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
};

/**
 * Union type for all API responses
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Type guard to check if response is successful
 */
export function isApiSuccess<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard to check if response is an error
 */
export function isApiError(
  response: ApiResponse<unknown>
): response is ApiErrorResponse {
  return response.success === false;
}

/**
 * Auth Response Types
 */
export type AuthTokenResponse = {
  token: string;
  user: Omit<User, "password">;
};

export type LoginResponse = ApiResponse<AuthTokenResponse>;
export type SignupResponse = ApiResponse<AuthTokenResponse>;

/**
 * User Response Types
 */
export type UserResponse = ApiResponse<User>;
export type UsersResponse = ApiResponse<User[]>;

/**
 * Helper type for extracting data type from ApiResponse
 */
export type ExtractApiData<T> = T extends ApiResponse<infer D> ? D : never;

