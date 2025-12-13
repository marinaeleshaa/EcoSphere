import { rootContainer } from "@/backend/config/container";
import UserController from "@/backend/features/user/user.controller";
import { ApiResponse, ok, serverError } from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
	req: NextRequest
): Promise<NextResponse<ApiResponse<{ message: string }>>> => {
	const userId = req.nextUrl.pathname.split("/")[4];
	try {
		const response = await rootContainer
			.resolve(UserController)
			.redeemUserPoints(userId);
		return ok(response);
	} catch (error) {
		console.error(error);
		return serverError();
	}
};
