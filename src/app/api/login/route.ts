import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import AuthController from "@/backend/features/auth/auth.controller";
import {
  handleControllerResponse,
  handleError,
} from "@/types/api-helpers";
import type { LoginResponse } from "@/types/api.types";

export const POST = async (
  request: NextRequest
): Promise<NextResponse<LoginResponse>> => {
  const { email, password } = await request.json();
  const controller = rootContainer.resolve(AuthController);

  try {
    const result = await controller.LogIn(email, password);
    return handleControllerResponse(
      result,
      "Login successful",
      "Either email or password is incorrect",
      401
    );
  } catch (error) {
    return handleError(error, 500);
  }
};
