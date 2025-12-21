import { NextRequest } from "next/server";
import { UploadController } from "@/backend/features/upload/upload.controller";
import { requireAuth } from "@/backend/utils/authHelper";
import { badRequest, ok, serverError } from "@/types/api-helpers";
import { rootContainer } from "@/backend/config/container";

export async function POST(req: NextRequest) {
  try {
    await requireAuth(); // Still require auth for security

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return badRequest("No file uploaded");

    const controller = rootContainer.resolve(UploadController);
    const result = await controller.uploadGeneric(file);

    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError();
  }
}
