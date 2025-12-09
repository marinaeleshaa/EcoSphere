import { NextRequest } from "next/server";
import { container } from "tsyringe";
import { UploadController } from "@/backend/features/upload/upload.controller";
import { requireAuth } from "@/backend/utils/authHelper";
import { badRequest, ok, serverError } from "@/types/api-helpers";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return badRequest("No file uploaded");

    const controller = container.resolve(UploadController);
    const result = await controller.uploadAvatar(user, file);

    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError()
  }
}

export async function DELETE() {
  try {
    const user = await requireAuth();

    const controller = container.resolve(UploadController);
    const result = await controller.deleteAvatar(user);

    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError()
  }
}
