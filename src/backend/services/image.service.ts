import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET_NAME } from "../config/s3.config";
import sharp from "sharp";
import crypto from "crypto";

export class ImageService {
  /**
   * Resizes an image buffer to specified dimensions.
   */
  async resizeImage(buffer: Buffer, width: number = 300, height: number = 300): Promise<Buffer> {
    return await sharp(buffer)
      .resize(width, height, {
        fit: "cover",
      })
      .toBuffer();
  }

  /**
   * Uploads a file to S3.
   */
  async uploadImage(fileBuffer: Buffer, mimeType: string): Promise<string> {
    const fileName = this.generateRandomFileName();
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await s3Client.send(command);
    return fileName;
  }

  /**
   * Deletes a file from S3.
   */
  async deleteImage(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  }

  /**
   * Generates a signed URL for accessing a file.
   */
  async getSignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    // URL expires in 1 hour (3600 seconds)
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  }

  /**
   * Generates a random file name using crypto.
   */
  private generateRandomFileName(bytes: number = 32): string {
    return crypto.randomBytes(bytes).toString("hex");
  }
}

export const imageService = new ImageService();
