import { injectable, inject } from "tsyringe";
import { type IUploadRepository } from "./upload.repository";
import { ImageService } from "../../services/image.service";

export type AvatarData = {
  key: string;
  url: string;
};

export interface IUploadService {
  uploadAvatar(
    userId: string,
    userRole: string,
    fileBuffer: Buffer,
    mimeType: string
  ): Promise<AvatarData>;
  deleteAvatar(userId: string, userRole: string): Promise<void>;
  uploadGenericImage(fileBuffer: Buffer, mimeType: string): Promise<AvatarData>;
}

@injectable()
export class UploadService {
  constructor(
    @inject("UploadRepository")
    private readonly uploadRepository: IUploadRepository,
    @inject("ImageService") private readonly imageService: ImageService
  ) {}

  async uploadAvatar(
    userId: string,
    userRole: string,
    fileBuffer: Buffer,
    mimeType: string
  ) {
    // 1. Resize image
    const resizedBuffer = await this.imageService.resizeImage(fileBuffer);

    // 2. Upload to S3
    const key = await this.imageService.uploadImage(resizedBuffer, mimeType);

    // 3. Handle specific role logic (delete old avatar, update DB)
    if (userRole === "shop") {
      const shop = await this.uploadRepository.findRestaurantById(userId);
      if (!shop) throw new Error("Shop not found");

      // Delete old avatar if exists
      if (shop.avatar?.key) {
        await this.imageService.deleteImage(shop.avatar.key);
      }

      await this.uploadRepository.updateRestaurantAvatar(userId, key);
    } else {
      const user = await this.uploadRepository.findUserById(userId);
      if (!user) throw new Error("User not found");

      // Delete old avatar if exists
      if (user.avatar?.key) {
        await this.imageService.deleteImage(user.avatar.key);
      }
      await this.uploadRepository.updateUserAvatar(userId, key);
    }

    // 4. Generate Signed URL
    const signedUrl = await this.imageService.getSignedUrl(key);

    return {
      key,
      url: signedUrl,
    };
  }

  async uploadGenericImage(fileBuffer: Buffer, mimeType: string) {
    const resizedBuffer = await this.imageService.resizeImage(fileBuffer);
    const key = await this.imageService.uploadImage(resizedBuffer, mimeType);
    const signedUrl = await this.imageService.getSignedUrl(key);

    return {
      key,
      url: signedUrl,
    };
  }

  async deleteAvatar(userId: string, userRole: string) {
    if (userRole === "shop") {
      const shop = await this.uploadRepository.findRestaurantById(userId);
      if (!shop) throw new Error("Shop not found");

      if (shop.avatar?.key) {
        await this.imageService.deleteImage(shop.avatar.key);
        await this.uploadRepository.clearRestaurantAvatar(userId);
      }
    } else {
      const user = await this.uploadRepository.findUserById(userId);
      if (!user) throw new Error("User not found");

      if (user.avatar?.key) {
        await this.imageService.deleteImage(user.avatar.key);
        await this.uploadRepository.clearUserAvatar(userId);
      }
    }
  }
}
