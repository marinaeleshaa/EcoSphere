import { rootContainer } from "@/backend/config/container";
import UserController from "@/backend/features/user/user.controller";
import { ok, serverError } from "@/types/api-helpers";

export const GET = async () => {
  try {
    const res = await rootContainer.resolve(UserController).getRecycleAgents();
    return ok(res);
  } catch (error) {
    console.error(error);
    return serverError();
  }
};
