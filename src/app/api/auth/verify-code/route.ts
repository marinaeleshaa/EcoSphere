import { rootContainer } from "@/backend/config/container";
import UserController from "@/backend/features/user/user.controller";
import { ok, serverError } from "@/types/api-helpers";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { email, code } = await req.json();
    const controller = rootContainer.resolve(UserController);
    const result = await controller.verifyCode(email,code);
    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Failed to send code");
  }
};
