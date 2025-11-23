import { rootContainer } from "@/backend/config/container";
import UserController from "@/backend/features/user/user.controller";
import { IUser } from "@/backend/features/user/user.model";
import { ApiResponse, badRequest, ok, serverError } from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<IUser>>> => {
  const { id } = await context.params;
  try {
    const controller = rootContainer.resolve(UserController);
    const result = await controller.getById(id);
    return ok(result);
  } catch (error) {
    console.log(error);
    return serverError("Something went wrong");
  }
};

export const PUT = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<IUser>>> => {
  const { id } = await context.params;
  const body = await _req.json();

  try {
    const controller = rootContainer.resolve(UserController);
    const result = await controller.updateById(id, body);
    return ok(result);
  } catch (error) {
    console.log(error);
    return serverError("Something went wrong");
  }
};

export const PATCH = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<IUser>>> => {
  const { id } = await context.params;
  const body = await _req.json();
  const { favoritesIds } = body as { favoritesIds?: string };
  if (!favoritesIds) {
    return badRequest("Missing favoritesIds");
  }
  try {
    const controller = rootContainer.resolve(UserController);
    const result = await controller.updateFavorites(id, favoritesIds);
    return ok(result);
  } catch (error) {
    console.log(error);
    return serverError("Something went wrong");
  }
};

export const DELETE = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<IUser>>> => {
  const { id } = await context.params;
  try {
    const controller = rootContainer.resolve(UserController);
    const result = await controller.deleteById(id);
    return ok(result);
  } catch (error) {
    console.log(error);
    return serverError("Something went wrong");
  }
};
