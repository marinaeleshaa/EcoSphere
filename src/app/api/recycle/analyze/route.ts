import { NextRequest, NextResponse } from "next/server";
import { container } from "tsyringe";
import { RecycleController } from "@/backend/features/recycle/recycle.controller";
import "@/backend/config/container"; // Ensure DI is set up

export async function POST(req: NextRequest) {
  try {
    const controller = container.resolve(RecycleController);
    const formData = await req.formData();
    const result = await controller.analyzeImages(formData);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
