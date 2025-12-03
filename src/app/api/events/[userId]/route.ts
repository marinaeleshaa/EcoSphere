import { rootContainer } from "@/backend/config/container";
import EventController from "@/backend/features/event/event.controller";
import { IEvent } from "@/backend/features/user/user.model";
import { ApiResponse, ok, serverError } from "@/types/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
): Promise<NextResponse<ApiResponse<IEvent[]>>> => {
  const { userId } = await context.params;
  try {
    return ok(
      await rootContainer.resolve(EventController).getEventsByUserId(userId)
    );
  } catch (error) {
    console.log(error);
    return serverError("Something went wrong");
  }
};

export const POST = async (
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
): Promise<NextResponse<ApiResponse<IEvent>>> => {
  const body = await req.json();
  const { userId } = await context.params;
  try {
    return ok(
      await rootContainer.resolve(EventController).createEvent(userId, body)
    );
  } catch (error) {
    console.log(error);
    return serverError("Something went wrong");
  }
};

export const PUT = async (
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
): Promise<NextResponse<ApiResponse<IEvent>>> => {
  const { userId } = await context.params;
  const body = await req.json();
  try {
    return ok(
      await rootContainer.resolve(EventController).updateEvent(userId, body)
    );
  } catch (error) {
    console.log(error);
    return serverError("Something went wrong");
  }
};

export const DELETE = async (
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
): Promise<NextResponse<ApiResponse<IEvent>>> => {
  const { userId } = await context.params;
  const { eventId } = await req.json();
  try {
    return ok(
      await rootContainer.resolve(EventController).deleteEvent(userId, eventId)
    );
  } catch (error) {
    console.log(error);
    return serverError("Something went wrong");
  }
};
