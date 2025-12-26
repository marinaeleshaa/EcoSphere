import { injectable, inject } from "tsyringe";
import { type IAIService } from "./ai.service";
import { NextRequest, NextResponse } from "next/server";
import { badRequest, serverError } from "@/types/api-helpers";
import { ChatRequestDTO } from "./dto/ai-context.dto";
import { auth } from "@/auth";

@injectable()
export class AIController {
  constructor(@inject("AIService") private readonly aiService: IAIService) {}

  async chatWithAssistant(req: NextRequest): Promise<NextResponse> {
    try {
      // Extract authentication from session
      const session = await auth();
      const userId = session?.user?.id;
      // Restaurant authentication uses separate model - check if user IS a restaurant
      const restaurantId =
        session?.user?.role === "restaurant" ? session.user.id : undefined;

      const body = (await req.json()) as ChatRequestDTO;

      // Basic validation
      if (!body?.message || typeof body.message !== "string")
        return badRequest("Message is required and must be a string");

      // Validate and limit conversation history
      const conversationHistory = Array.isArray(body.conversationHistory)
        ? body.conversationHistory.slice(-5) // Keep last 5 messages
        : undefined;

      // Normalize context
      const context =
        body.context && typeof body.context === "object"
          ? body.context
          : undefined;

      const answer = await this.aiService.generateResponse(
        body.message,
        conversationHistory, // NEW
        context,
        userId, // NEW
        restaurantId // NEW
      );

      return NextResponse.json({ answer });
    } catch (error: any) {
      console.error("AI Controller Error:", error);

      // Enhanced error handling
      if (error.message === "RATE_LIMIT") {
        return NextResponse.json(
          { error: "Too many requests. Please wait a moment and try again." },
          { status: 429 }
        );
      }

      if (error.message === "SERVICE_UNAVAILABLE") {
        return serverError(
          "I'm having trouble right now. Please try again in a moment."
        );
      }

      return serverError("Failed to generate AI response");
    }
  }
}
