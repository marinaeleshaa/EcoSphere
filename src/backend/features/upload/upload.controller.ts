import { injectable, inject } from "tsyringe";
import { UploadService } from "./upload.service";
import { DBInstance } from "@/backend/config/dbConnect";

@injectable()
export class UploadController {
  constructor(
    @inject(UploadService) private readonly uploadService: UploadService
  ) {}

  /**
   * Uploads an avatar for a user or restaurant.
   */
  async uploadAvatar(req: any): Promise<any> {
    try {
      if (!req.file) {
        return { status: 400, message: "No file uploaded" };
      }

      const userId = req.user._id;
      const userRole = req.user.role;
      const fileBuffer = req.file.buffer;
      const mimeType = req.file.mimetype;

      const avatarData = await this.uploadService.uploadAvatar(userId, userRole, fileBuffer, mimeType);

      return {
        status: 200,
        message: "Avatar uploaded successfully",
        data: {
          avatar: avatarData,
        },
      };
    } catch (error: any) {
      console.error("Upload error:", error);
      const status = error.message.includes("not found") ? 404 : 500;
      return { status, message: "Upload failed", error: error.message };
    }
  }

  /**
   * Deletes the avatar for a user or restaurant.
   */
  async deleteAvatar(req: any): Promise<any> {
    try {
      const userId = req.user._id;
      const userRole = req.user.role;

      await this.uploadService.deleteAvatar(userId, userRole);

      return { status: 200, message: "Avatar deleted successfully" };
    } catch (error: any) {
      console.error("Delete error:", error);
      const status = error.message.includes("not found") ? 404 : 500;
      return { status, message: "Delete failed", error: error.message };
    }
  }
}
