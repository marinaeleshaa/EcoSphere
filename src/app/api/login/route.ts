import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import AuthController from "@/backend/features/auth/auth.controller";
import type {
	LoginRequestDTO,
	LoginResponse,
} from "@/backend/features/auth/dto/user.dto";
import { ApiResponse, ok, serverError } from "@/types/api-helpers";

export const POST = async (
	request: NextRequest
): Promise<NextResponse<ApiResponse<LoginResponse>>> => {
	const body = (await request.json()) as LoginRequestDTO;
	const controller = rootContainer.resolve(AuthController);

	try {
		const result = await controller.loginWithCredentials(body);
		return ok(result);
	} catch (error) {
		console.log(error);
		return serverError("Something went wrong");
	}
};
