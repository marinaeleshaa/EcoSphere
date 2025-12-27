import { rootContainer } from "@/backend/config/container";
import { EventResponse } from "@/backend/features/event/events.types";
import { ApiResponse, ok, serverError } from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";
import EventController from "@/backend/features/event/event.controller";
import { getCurrentUser } from "@/backend/utils/authHelper";

export const GET = async (
  req: NextRequest
): Promise<NextResponse<ApiResponse<EventResponse[]>>> => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as
      | "accepted"
      | "rejected"
      | "pending"
      | null;

    const user = await getCurrentUser();
    const isAdmin = user?.role === "admin";
    return ok(
      await rootContainer
        .resolve(EventController)
        .getEvents(isAdmin, status || undefined)
    );
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};
