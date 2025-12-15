import { rootContainer } from "@/backend/config/container";
import { organizerOnly } from "@/backend/features/auth/middleware/route.config";
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
// import { ImageService } from "@/backend/services/image.service";

// const imageService = rootContainer.resolve(ImageService);

export const GET = async (): Promise<NextResponse<ApiResponse<EventResponse[]>>> => {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return unauthorized();
    }
    return ok(
      await rootContainer.resolve(EventController).getEventsByUserId(user.id)
    );
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};

export const POST = organizerOnly(
  async (
    req: NextRequest
  ): Promise<NextResponse<ApiResponse<EventResponse>>> => {
    try {
      const body = await req.json();
      const user = await getCurrentUser();
      if (!user?.id) {
        return unauthorized();
      }
      return ok(
        await rootContainer.resolve(EventController).createEvent(user.id, body)
      );
    } catch (error) {
      console.error(error);
      return serverError("Something went wrong");
    }
  }
);

export const PUT = organizerOnly(
  async (
    req: NextRequest
  ): Promise<NextResponse<ApiResponse<EventResponse>>> => {
    try {
      const body = await req.json();
      const user = await getCurrentUser();
      if (!user?.id) {
        return unauthorized();
      }
      return ok(
        await rootContainer.resolve(EventController).updateEvent(user.id, body)
      );
    } catch (error) {
      console.error(error);
      return serverError("Something went wrong");
    }
  }
);

export const DELETE = organizerOnly(
  async (
    req: NextRequest
  ): Promise<NextResponse<ApiResponse<EventResponse>>> => {
    try {
      const { eventId } = await req.json();
      const user = await getCurrentUser();
      if (!user?.id) {
        return unauthorized();
      }
      return ok(
        await rootContainer
          .resolve(EventController)
          .deleteEvent(user.id, eventId)
      );
    } catch (error) {
      console.error(error);
      return serverError("Something went wrong");
    }
  }
);
