import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import RecipeController from "@/backend/features/recipe/recipe.controller";
import {
  ApiResponse,
  ok,
  serverError,
  unauthorized,
} from "@/types/api-helpers";
import { getCurrentUser } from "@/backend/utils/authHelper";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const body = await req.json();
  const { ingredients } = body;

  const controller = rootContainer.resolve(RecipeController);
  try {
    const result = await controller.generate(user.id, ingredients);
    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Failed to generate recipe");
  }
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const controller = rootContainer.resolve(RecipeController);
  try {
    const result = await controller.getAll(user.id);
    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Failed to fetch recipes");
  }
};
