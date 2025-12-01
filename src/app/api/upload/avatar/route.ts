import { NextResponse } from "next/server";
import { container } from "tsyringe";
import { UploadController } from "@/backend/features/upload/upload.controller";
import { ImageService } from "@/backend/services/image.service";
import { verifyToken } from "@/backend/middleware/auth.middleware";

// Register dependencies
container.register("ImageService", { useClass: ImageService });

export async function POST(req: Request) {
  try {
    // 1. Auth Check
    const authResult = await verifyToken(req);
    if (authResult instanceof NextResponse) return authResult;
    const user = authResult; // verifyToken returns the user payload if successful

    // 2. Parse Multipart Form Data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Mock req object for controller
    const mockReq = {
      user,
      file: {
        buffer,
        mimetype: file.type,
      },
    };

    const controller = container.resolve(UploadController);
    const result = await controller.uploadAvatar(mockReq);

    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // 1. Auth Check
    const authResult = await verifyToken(req);
    if (authResult instanceof NextResponse) return authResult;
    const user = authResult;

    const mockReq = { user };

    const controller = container.resolve(UploadController);
    const result = await controller.deleteAvatar(mockReq);

    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
