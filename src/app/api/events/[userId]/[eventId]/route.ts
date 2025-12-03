import { rootContainer } from "@/backend/config/container";
import EventController from "@/backend/features/event/event.controller";
import { IEvent } from "@/backend/features/user/user.model";
import { ApiResponse, ok, serverError } from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ userId: string; eventId: string }> }
): Promise<NextResponse<ApiResponse<IEvent>>> => {
  const { userId, eventId } = await context.params;
  try {
    return ok(
      await rootContainer.resolve(EventController).getEvent(userId, eventId)
    );
  } catch (error) {
    console.log(error);
    return serverError("Something went wrong");
  }
};
