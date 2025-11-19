import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import AuthController from "@/backend/features/auth/auth.controller";
import type { LoginDto } from "@/backend/features/auth/dto/user.dto";
import {
  handleControllerResponse,
  handleError,
} from "@/types/api-helpers";
import type { LoginResponse } from "@/types/api.types";

export const POST = async (
  request: NextRequest
): Promise<NextResponse<LoginResponse>> => {
  const body = (await request.json()) as LoginDto;
  const controller = rootContainer.resolve(AuthController);

  try {
    const result = await controller.login(body);
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
