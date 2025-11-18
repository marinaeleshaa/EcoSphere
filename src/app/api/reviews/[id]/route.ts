import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import ReviewController from "@/backend/features/review/review.controller";

export const GET = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const controller = rootContainer.resolve(ReviewController);
    const result = await controller.getById(id);
    return NextResponse.json({ result });
}

export const PUT = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const body = await req.json();
    const controller = rootContainer.resolve(ReviewController);
    const result = await controller.update(id, body);
    return NextResponse.json({ result });
}

export const DELETE = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const controller = rootContainer.resolve(ReviewController);
    const result = await controller.delete(id);
    return NextResponse.json({ result });
}
