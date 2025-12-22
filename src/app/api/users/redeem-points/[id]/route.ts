import { rootContainer } from "@/backend/config/container";
import UserController from "@/backend/features/user/user.controller";
import { ApiResponse, ok } from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<{ message: string }>>> => {
  const { id: userId } = await params;

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "User ID is required" } as ApiResponse<{
        message: string;
      }>,
      { status: 400 }
    );
  }

  try {
    const response = await rootContainer
      .resolve(UserController)
      .redeemUserPoints(userId);
    return ok(response);
  } catch (error: any) {
    console.error("[Redeem Points Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to redeem points",
      } as ApiResponse<{ message: string }>,
      { status: 500 }
    );
  }
};
