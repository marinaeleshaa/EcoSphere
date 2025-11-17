import { rootContainer } from "@/backend/config/container";
import UserController from "@/backend/features/user/user.controller";
import { hashPassword } from "@/backend/utils/helpers";
import { NextRequest, NextResponse } from "next/server";
import {
  handleControllerResponse,
  handleError,
  createErrorResponse,
} from "@/types/api-helpers";
import type { UserResponse } from "@/types/api.types";

export const GET = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<UserResponse>> => {
  const { id } = await context.params;
  try {
    const controller = rootContainer.resolve(UserController);
    const result = await controller.getById(id);
    return handleControllerResponse(
      result,
      "User retrieved successfully",
      "User not found",
      404
    );
  } catch (error) {
    return handleError(error, 500);
  }
};

export const PUT = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<UserResponse>> => {
  const { id } = await context.params;
  const body = await _req.json();
  const { email, name, password } = body as {
    email?: string;
    name?: string;
    password?: string;
  };

  const updateData: Record<string, string> = {};
  if (typeof email === "string") updateData.email = email;
  if (typeof name === "string") updateData.name = name;
  if (typeof password === "string")
    updateData.password = await hashPassword(password);

  if (Object.keys(updateData).length === 0) {
    return createErrorResponse(
      "No valid fields provided for update",
      "No valid fields provided for update",
      400
    );
  }

  try {
    const controller = rootContainer.resolve(UserController);
    const result = await controller.updateById(id, updateData);
    return handleControllerResponse(
      result,
      "User updated successfully",
      "User not found or update failed",
      404
    );
  } catch (error) {
    return handleError(error, 500);
  }
};

export const DELETE = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<UserResponse>> => {
  const { id } = await context.params;
  try {
    const controller = rootContainer.resolve(UserController);
    const result = await controller.deleteById(id);
    return handleControllerResponse(
      result,
      "User deleted successfully",
      "User not found",
      404
    );
  } catch (error) {
    return handleError(error, 500);
  }
};