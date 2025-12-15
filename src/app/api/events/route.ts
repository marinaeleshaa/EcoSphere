import { rootContainer } from "@/backend/config/container";
import { EventResponse } from "@/backend/features/event/events.types";
import { ApiResponse, ok, serverError } from "@/types/api-helpers";
import { NextResponse } from "next/server";
import EventController from "@/backend/features/event/event.controller";

export const GET = async (): Promise<NextResponse<ApiResponse<EventResponse[]>>> => {
  try {
    return ok(await rootContainer.resolve(EventController).getEvents());
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};
