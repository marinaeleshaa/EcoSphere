import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import RestaurantController from "@/backend/features/restaurant/restaurant.controller";

export const GET = async (req: NextRequest) => {
  const controller = rootContainer.resolve(RestaurantController);
  const result = await controller.getAll();
  return NextResponse.json({ result });
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const controller = rootContainer.resolve(RestaurantController);
  console.log(body);
  const result = await controller.create(body);
  return NextResponse.json({ message: "Restaurant created", result });
};
