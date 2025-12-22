import { NextResponse } from "next/server";
import { OrderModel } from "@/backend/features/orders/order.model";
import { connectDB } from "@/backend/config/dbConnect";
import { Types } from "mongoose";

export async function GET() {
  await connectDB();
  const restaurantId = "692b8349e9f39a8a157fb982";

  // Create dummy random ObjectIds for users and products just for display
  const user1 = new Types.ObjectId();
  const user2 = new Types.ObjectId();
  const prod1 = new Types.ObjectId();
  const prod2 = new Types.ObjectId();
  const prod3 = new Types.ObjectId();

  const orders = [
    {
      userId: user1,
      restaurantId: new Types.ObjectId(restaurantId),
      items: [
        {
          productId: prod1,
          quantity: 2,
          unitPrice: 150,
          totalPrice: 300,
        },
      ],
      paymentMethod: "cashOnDelivery",
      orderPrice: 300,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: user2,
      restaurantId: new Types.ObjectId(restaurantId),
      items: [
        {
          productId: prod2,
          quantity: 1,
          unitPrice: 85.5,
          totalPrice: 85.5,
        },
      ],
      paymentMethod: "stripe",
      orderPrice: 85.5,
      status: "preparing",
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      updatedAt: new Date(),
    },
    {
      userId: user1,
      restaurantId: new Types.ObjectId(restaurantId),
      items: [
        {
          productId: prod1,
          quantity: 1,
          unitPrice: 150,
          totalPrice: 150,
        },
        {
          productId: prod3,
          quantity: 2,
          unitPrice: 50,
          totalPrice: 100,
        },
      ],
      paymentMethod: "paymob",
      orderPrice: 250,
      status: "delivering",
      createdAt: new Date(Date.now() - 7200000), // 2 hours ago
      updatedAt: new Date(),
    },
    {
      userId: user2,
      restaurantId: new Types.ObjectId(restaurantId),
      items: [
        {
          productId: prod2,
          quantity: 3,
          unitPrice: 85.5,
          totalPrice: 256.5,
        },
      ],
      paymentMethod: "cashOnDelivery",
      orderPrice: 256.5,
      status: "completed",
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      updatedAt: new Date(),
    },
  ];

  try {
    await OrderModel.insertMany(orders);
    return NextResponse.json({
      success: true,
      message: `Seeded ${orders.length} orders for restaurant ${restaurantId}`,
      data: orders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
