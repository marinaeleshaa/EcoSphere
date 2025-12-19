import { rootContainer } from "@/backend/config/container";
import EventController from "@/backend/features/event/event.controller";
import { EventResponse } from "@/backend/features/event/events.types";
import { getCurrentUser } from "@/backend/utils/authHelper";
import {
  ApiResponse,
  ok,
  serverError,
  unauthorized,
} from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: {
    params: Promise<{ eventId: string }>;
  }
): Promise<NextResponse<ApiResponse<EventResponse>>> => {
  try {
    const { eventId } = await context.params;
    const user = await getCurrentUser();
    if (!user?.id) {
      return unauthorized();
    }
    return ok(
      await rootContainer.resolve(EventController).getEvent(user.id, eventId)
    );
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};

export const PATCH = async (
  req: NextRequest,
  context: {
    params: Promise<{ eventId: string }>;
  }
): Promise<NextResponse<ApiResponse<string>>> => {
  try {
    const { eventId } = await context.params;
    const user = await getCurrentUser();
    if (!user?.id) {
      return unauthorized();
    }
    await rootContainer
      .resolve(EventController)
      .attendEvent(user.id, eventId);
    return ok("Event updated successfully");
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};
