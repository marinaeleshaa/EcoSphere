import { injectable, inject } from "tsyringe";
import { type IAIService } from "./ai.service";
import { NextRequest, NextResponse } from "next/server";
import { badRequest, serverError } from "@/types/api-helpers";
import { ChatRequestDTO } from "./dto/ai-context.dto";

@injectable()
export class AIController {
  constructor(@inject("AIService") private readonly aiService: IAIService) {}

  async chatWithAssistant(req: NextRequest): Promise<NextResponse> {
    try {
      const body = (await req.json()) as ChatRequestDTO;

      // Basic validation (robust but lightweight)
      if (!body?.message || typeof body.message !== "string")
        return badRequest("Message is required and must be a string");
      
      // Normalize input
      const locale = typeof body.locale === "string" ? body.locale : "en";
      const context =
        body.context && typeof body.context === "object" 
          ? body.context 
          : undefined;

      const answer = await this.aiService.generateResponse(
        body.message,
        context,
        locale
      );
      return NextResponse.json({ answer });
    } catch (error: any) {
      console.error("AI Controller Error:", error);
      return serverError("Failed to generate AI response")
    }
  }
}
