import { injectable, inject } from "tsyringe";
import { type IAIService } from "./ai.service";
import { NextRequest, NextResponse } from "next/server";

@injectable()
export class AIController {
  constructor(@inject("AIService") private readonly aiService: IAIService) {}

  async chatWithAssistant(req: NextRequest) {
    try {
      const body = await req.json();
      const { message, context, locale } = body;

      if (!message) {
        return NextResponse.json(
          { error: "Message is required" },
          { status: 400 }
        );
      }

      const answer = await this.aiService.generateResponse(
        message,
        context,
        locale
      );
      return NextResponse.json({ answer });
    } catch (error: any) {
      console.error("AI Controller Error:", error);
      return NextResponse.json(
        { error: "Failed to generate AI response" },
        { status: 500 }
      );
    }
  }
}
