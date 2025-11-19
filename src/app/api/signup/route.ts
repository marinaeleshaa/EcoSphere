import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import AuthController from "@/backend/features/auth/auth.controller";
import type { RegisterDto } from "@/backend/features/auth/dto/user.dto";
import {
  handleControllerResponse,
  handleError,
} from "@/types/api-helpers";
import type { SignupResponse } from "@/types/api.types";

export const POST = async (
  request: NextRequest
): Promise<NextResponse<SignupResponse>> => {
  const body = (await request.json()) as RegisterDto;
  const controller = rootContainer.resolve(AuthController);

  try {
    const result = await controller.Register(body);
    return handleControllerResponse(
      result,
      "User registered successfully",
      "User already exists",
      409
    );
  } catch (error) {
    return handleError(error, 500);
  }
};
