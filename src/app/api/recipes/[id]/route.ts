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

export const DELETE = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const { id } = await context.params;
  const controller = rootContainer.resolve(RecipeController);

  try {
    // We pass user.id to ensure users can only delete their own recipes
    const result = await controller.delete(id, user.id);
    if (!result) return serverError("Recipe not found or unauthorized");
    return ok({ success: true });
  } catch (error) {
    console.error(error);
    return serverError("Failed to delete recipe");
  }
};
