import { rootContainer } from "@/backend/config/container";
import UserController from "@/backend/features/user/user.controller";
import { IUser } from "@/backend/features/user/user.model";
import { getCurrentUser } from "@/backend/utils/authHelper";
import {ApiResponse, ok, serverError, unauthorized } from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest
): Promise<NextResponse<ApiResponse<IUser>>> => {
  const session = await getCurrentUser();
  if (!session?.id) {
    return unauthorized();
  }

  const query = _req.nextUrl.searchParams.get("q") || undefined;

  const controller = rootContainer.resolve(UserController);
  try {
    const result = await controller.getById(session.id, query);
    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};

export const PUT = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<IUser>>> => {
  const { id } = await context.params;
  const body = await _req.json();
  const controller = rootContainer.resolve(UserController);

  try {
    const result = await controller.updateById(id, body);
    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};

export const DELETE = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<IUser>>> => {
  const { id } = await context.params;
  const controller = rootContainer.resolve(UserController);
  try {
    const result = await controller.deleteById(id);
    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};
