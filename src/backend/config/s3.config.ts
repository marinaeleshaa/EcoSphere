import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.AWS_S3_ACCESS_KEY;
const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY;

if (!bucketRegion || !accessKey || !secretAccessKey) {
  throw new Error("Missing AWS S3 configuration in .env file");
}

export const s3Client = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
});

export const BUCKET_NAME = process.env.BUCKET_NAME;
