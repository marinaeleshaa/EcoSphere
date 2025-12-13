import { rootContainer } from "@/backend/config/container";
import { AIController } from "@/backend/features/ai/ai.controller";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const controller = rootContainer.resolve(AIController);
  return await controller.chatWithAssistant(req);
};
