import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import ReviewController from "@/backend/features/review/review.controller";

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams;
    const restaurantId = searchParams.get('restaurantId') || undefined;
    const controller = rootContainer.resolve(ReviewController);
    const result = await controller.getAll(restaurantId);
    return NextResponse.json({ result });
}

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    const controller = rootContainer.resolve(ReviewController);
    const result = await controller.create(body);
    return NextResponse.json({ result });
}
