import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import RestaurantController from "@/backend/features/resturant/resturant.controller";

export const GET = async (req: NextRequest) => {
    const controller = rootContainer.resolve(RestaurantController);
    const result = await controller.getAll();
    return NextResponse.json({ message: "hello after db connection", result });
}

