import { NextRequest } from "next/server";
import { rootContainer } from "@/backend/config/container";
import UserController from "@/backend/features/user/user.controller";
import { ok, serverError } from "@/types/api-helpers";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const body = await req.json();

  try {
    const response = await rootContainer
      .resolve(UserController)
      .updateById(id, body);

    return ok(response);
  } catch (error) {
    console.error(error);
    return serverError();
  }
};
