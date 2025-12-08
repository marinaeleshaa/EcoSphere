import { rootContainer } from "@/backend/config/container";
import EventController from "@/backend/features/event/event.controller";
import { IEvent } from "@/backend/features/user/user.model";
import { ApiResponse, ok, serverError } from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest
): Promise<NextResponse<ApiResponse<IEvent[]>>> => {
  try {
    return ok(await rootContainer.resolve(EventController).getEvents());
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};
