import { rootContainer } from "@/backend/config/container";
import UserController from "@/backend/features/user/user.controller";
import { IUser } from "@/backend/features/user/user.model";
import { ApiResponse, ok, serverError, unauthorized } from "@/types/api-helpers";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const GET = async (): Promise<NextResponse<ApiResponse<IUser[]>>> => {
  return ok(await rootContainer.resolve(UserController).getAll());
};

// Get current user endpoint - returns PublicUserProfile with proper avatar URL
export const POST = async (): Promise<NextResponse<ApiResponse<IUser>>> => {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return unauthorized("Not authenticated");
    }

    const controller = rootContainer.resolve(UserController);
    const user = await controller.getById(session.user.id);
    
    // Convert to PublicUserProfile to get proper avatar URL;
    return ok(user);
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};
