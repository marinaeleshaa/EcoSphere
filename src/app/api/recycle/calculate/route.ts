import { rootContainer } from "@/backend/config/container";
import { NextRequest } from "next/server";
import { RecycleController } from "@/backend/features/recycle/recycle.controller";

export async function POST(req: NextRequest) {
  const recycleController = rootContainer.resolve(RecycleController);
  return recycleController.calculateManual(req);
}
