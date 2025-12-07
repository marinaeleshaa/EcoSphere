import { rootContainer } from "@/backend/config/container";
import EventController from "@/backend/features/event/event.controller";
import { IEvent } from "@/backend/features/user/user.model";
import { getCurrentUser } from "@/backend/utils/authHelper";
import {
  ApiResponse,
  ok,
  serverError,
  unauthorized,
} from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest
): Promise<NextResponse<ApiResponse<IEvent[]>>> => {
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

export const POST = async (
  req: NextRequest
): Promise<NextResponse<ApiResponse<IEvent>>> => {
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
};

export const PUT = async (
  req: NextRequest
): Promise<NextResponse<ApiResponse<IEvent>>> => {
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
};

export const DELETE = async (
  req: NextRequest
): Promise<NextResponse<ApiResponse<IEvent>>> => {
  try {
    const { eventId } = await req.json();
    const user = await getCurrentUser();
    if (!user?.id) {
      return unauthorized();
    }
    return ok(
      await rootContainer.resolve(EventController).deleteEvent(user.id, eventId)
    );
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};
