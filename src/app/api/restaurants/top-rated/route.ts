import { NextRequest, NextResponse } from "next/server";
import "@/backend/config/container";
import { container } from "tsyringe";
import RestaurantController from "@/backend/features/restaurant/restaurant.controller";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Number.parseInt(limitParam, 10) : 15;

    // Validate limit
    if (Number.isNaN(limit) || limit < 1 || limit > 50) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid limit parameter. Must be between 1 and 50.",
        },
        { status: 400 }
      );
    }

    const restaurantController = container.resolve(RestaurantController);
    const restaurants = await restaurantController.getFirst(limit);

    return NextResponse.json(
      {
        success: true,
        data: restaurants.map((restaurant) => ({
          id: restaurant._id,
          name: restaurant.name,
          image: restaurant.avatar?.url || null,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch restaurants",
      },
      { status: 500 }
    );
  }
}
