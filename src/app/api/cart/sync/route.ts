import { rootContainer } from "@/backend/config/container";
import UserController from "@/backend/features/user/user.controller";
import { requireAuth } from "@/backend/utils/authHelper";
import { ok, serverError } from "@/types/api-helpers";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const response = await rootContainer
      .resolve(UserController)
      .saveUserCart(user.id, body);
    return ok(response);
  } catch (error) {
    console.error(error);
    return serverError();
  }
};
