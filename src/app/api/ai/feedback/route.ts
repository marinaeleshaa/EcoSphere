import { NextRequest, NextResponse } from "next/server";
import { ChatFeedbackModel } from "@/backend/features/ai/feedback.model";
import { auth } from "@/auth";
import { DBInstance } from "@/backend/config/dbConnect";

export async function POST(req: NextRequest) {
  try {
    await DBInstance.getConnection();

    const session = await auth();
    const body = await req.json();

    // Validate required fields
    if (
      !body.messageId ||
      !body.userMessage ||
      !body.aiResponse ||
      !body.rating
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate rating
    if (!["positive", "negative"].includes(body.rating)) {
      return NextResponse.json(
        { success: false, error: "Invalid rating value" },
        { status: 400 }
      );
    }

    const feedback = await ChatFeedbackModel.create({
      messageId: body.messageId,
      userId: session?.user?.id || undefined,
      userMessage: body.userMessage,
      aiResponse: body.aiResponse,
      rating: body.rating,
      context: body.context,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error: any) {
    console.error("Feedback error:", error);

    // Handle duplicate messageId
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "Feedback already submitted for this message",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}
