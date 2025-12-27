import { rootContainer } from "@/backend/config/container";
import {
  adminOnly,
  organizerOnly,
} from "@/backend/features/auth/middleware/route.config";
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
import { UploadController } from "@/backend/features/upload/upload.controller";

async function parseEventFormData(formData: FormData) {
  const body: any = {};
  formData.forEach((value, key) => {
    if (key === "sections") {
      try {
        body[key] = JSON.parse(value as string);
      } catch (e) {
        console.error("Error parsing sections:", e);
      }
    } else if (key === "avatar") {
      // Handled separately
    } else if (key === "capacity" || key === "ticketPrice") {
      body[key] = Number(value);
    } else {
      body[key] = value;
    }
  });

  const avatarFile = formData.get("avatar") as File | null;
  if (avatarFile && avatarFile instanceof File) {
    const uploadController = rootContainer.resolve(UploadController);
    const uploadResult = await uploadController.uploadGeneric(avatarFile);
    body.avatar = {
      key: uploadResult.key,
      url: uploadResult.url,
    };
  } else {
    const avatarKey = formData.get("avatarKey") as string | null;
    if (avatarKey) {
      body.avatar = { key: avatarKey };
    }
  }
  return body;
}

export const GET = async (): Promise<
  NextResponse<ApiResponse<EventResponse[]>>
> => {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return unauthorized();
    }
    return ok(
      await rootContainer.resolve(EventController).getEventsByUserId(user.id),
    );
  } catch (error) {
    console.error(error);
    return serverError("Something went wrong");
  }
};

export const POST = organizerOnly(
  async (
    req: NextRequest,
  ): Promise<NextResponse<ApiResponse<EventResponse>>> => {
    try {
      const user = await getCurrentUser();
      if (!user?.id) {
        return unauthorized();
      }

      const contentType = req.headers.get("content-type") || "";
      let body;

      if (contentType.includes("multipart/form-data")) {
        const formData = await req.formData();
        body = await parseEventFormData(formData);
      } else {
        body = await req.json();
      }

      return ok(
        await rootContainer.resolve(EventController).createEvent(user.id, body),
      );
    } catch (error) {
      console.error(error);
      return serverError("Something went wrong");
    }
  },
);

export const PUT = organizerOnly(
  async (
    req: NextRequest,
  ): Promise<NextResponse<ApiResponse<EventResponse>>> => {
    try {
      const user = await getCurrentUser();
      if (!user?.id) {
        return unauthorized();
      }

      const contentType = req.headers.get("content-type") || "";
      let body;

      if (contentType.includes("multipart/form-data")) {
        const formData = await req.formData();
        body = await parseEventFormData(formData);
      } else {
        body = await req.json();
      }

      return ok(
        await rootContainer.resolve(EventController).updateEvent(user.id, body),
      );
    } catch (error) {
      console.error(error);
      return serverError("Something went wrong");
    }
  },
);

export const DELETE = organizerOnly(
  async (req: NextRequest): Promise<NextResponse<ApiResponse<string>>> => {
    try {
      const { eventId } = await req.json();
      const user = await getCurrentUser();
      if (!user?.id) {
        return unauthorized();
      }
      await rootContainer
        .resolve(EventController)
        .deleteEvent(user.id, eventId);
      return ok("Event deleted successfully");
    } catch (error) {
      console.error(error);
      return serverError("Something went wrong");
    }
  },
);

export const PATCH = adminOnly(
  async (req: NextRequest): Promise<NextResponse<ApiResponse<string>>> => {
    try {
      const { eventId, action } = await req.json();
      const user = await getCurrentUser();
      if (!user?.id) {
        return unauthorized();
      }
      let response;
      if (action === "accept") {
        await rootContainer.resolve(EventController).acceptEvent(eventId);
        response = "Event accepted successfully";
      } else if (action === "reject") {
        await rootContainer.resolve(EventController).rejectEvent(eventId);
        response = "Event rejected successfully";
      }
      return ok(response);
    } catch (error) {
      console.error(error);
      return serverError("Something went wrong");
    }
  },
);
