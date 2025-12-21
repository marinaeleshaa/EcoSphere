import { rootContainer } from "@/backend/config/container";// Ensure DI is set up
import { NextRequest, NextResponse } from "next/server";
import { RecycleController } from "@/backend/features/recycle/recycle.controller";

export async function POST(req: NextRequest) {
  try {
    const controller = rootContainer.resolve(RecycleController);
    const formData = await req.formData();
    const result = await controller.analyzeImages(formData);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
