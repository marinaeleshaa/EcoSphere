import { rootContainer } from "@/backend/config/container";
import { NextRequest, NextResponse } from "next/server";
import { RecycleController } from "@/backend/features/recycle/recycle.controller";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await params;
    const controller = rootContainer.resolve(RecycleController);
    const entries = await controller.getRecycleEntriesByEmail(email);
    return NextResponse.json(entries);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch recycling entries" },
      { status: 500 }
    );
  }
}
