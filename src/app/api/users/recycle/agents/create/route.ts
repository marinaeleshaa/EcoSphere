import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import AuthController from "@/backend/features/auth/auth.controller";
import { NewRecycleAgentFormData } from "@/types/recycleAgent";

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as NewRecycleAgentFormData;
  const createdAgent = await rootContainer
    .resolve(AuthController)
    .register(body);

  return NextResponse.json({ success: true, data: createdAgent });
};
