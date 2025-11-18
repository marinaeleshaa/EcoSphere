import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import RestaurantController from "@/backend/features/resturant/resturant.controller";

export const GET = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const controller = rootContainer.resolve(RestaurantController);
    const result = await controller.getById(id);
    return NextResponse.json({ message: "hello after db connection", result });
}

export const PUT = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const body = await req.json();
    const controller = rootContainer.resolve(RestaurantController);
    const result = await controller.updateById(id, body);
    return NextResponse.json({ message: "hello after db connection", result });
}

export const DELETE = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const controller = rootContainer.resolve(RestaurantController);
    const result = await controller.deleteById(id);
    return NextResponse.json({ message: "hello after db connection", result });
}