import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import AuthController from "@/backend/features/auth/auth.controller";
import type {
  RegisterRequestDTO,
  RegisterResponseDTO,
} from "@/backend/features/auth/dto/user.dto";
import { ApiResponse, ok, serverError } from "@/types/api-helpers";

export const POST = async (
  request: NextRequest
): Promise<NextResponse<ApiResponse<RegisterResponseDTO>>> => {
  const body = (await request.json()) as RegisterRequestDTO;
  const controller = rootContainer.resolve(AuthController);

  try {
    const result = await controller.register(body);
    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};
