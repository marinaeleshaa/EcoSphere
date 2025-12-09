import { S3Client } from "@aws-sdk/client-s3";

declare global {
  // prevents duplication in dev hot-reload
  var _s3: S3Client | undefined;
}

export const s3Client =
  globalThis._s3 ??
  new S3Client({
    region: process.env.BUCKET_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
    },
  });

if (process.env.NODE_ENV !== "production") globalThis._s3 = s3Client;

export const BUCKET_NAME = process.env.BUCKET_NAME!;
