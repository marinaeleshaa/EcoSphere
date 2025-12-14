import { NextRequest } from "next/server";
import { container } from "tsyringe";
import { RecycleController } from "@/backend/features/recycle/recycle.controller";
import "@/backend/config/container";

export async function POST(req: NextRequest) {
  const recycleController = container.resolve(RecycleController);
  return recycleController.calculateManual(req);
}
