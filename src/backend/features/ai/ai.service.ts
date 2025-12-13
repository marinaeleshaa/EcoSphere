import { injectable, inject } from "tsyringe";
import { type IAIRepository } from "./ai.repository";
import { types } from "./dto/ai-context.dto";

export interface IAIService {
  generateResponse(
    userMessage: string,
    context?: { type: types; id?: string },
    locale?: string
  ): Promise<string>;
}

@injectable()
export class AIService implements IAIService {
  private readonly hfToken = process.env.HUGGING_FACE_ACCESS_TOKEN;
  private readonly model = "meta-llama/Meta-Llama-3-8B-Instruct";
  // The new standard router URL for OpenAI-compatible chat completions
  private readonly apiUrl = "https://router.huggingface.co/v1/chat/completions";

  constructor(
    @inject("AIRepository")
    private readonly aiRepository: IAIRepository
  ) {}

  async generateResponse(
    userMessage: string,
    context?: { type: "product" | "restaurant" | "static"; id?: string },
    locale: string = "en"
  ): Promise<string> {
    if (!this.hfToken) {
      console.error("Missing HUGGING_FACE_ACCESS_TOKEN");
      return "I am currently offline. Please configure my API token.";
    }

    // --- Prepare context ---
    const generalContext = this.aiRepository.getGeneralContext();
    const pageContext = await this.resolveContext(context);
    const globalStructure = await this.aiRepository.getGlobalStructure();

    const systemContent = `
      You are the EcoSphere Assistant, a helpful AI for a sustainability marketplace.
      Tone: Encouraging, green, and emoji-friendly 🌱.
      Constraint: Keep answers concise (under 3 sentences).
      Reply in ${this.getLanguage(locale)}.

      Linking Rules:
      • Restaurants → [Name](/shop/ID)
      • Products → [Name](/store/ID)
      • NEVER show raw IDs in visible text.

      Knowledge Base: Use the provided JSON context to answer questions.
      GLOBAL SNAPSHOT:
      ${globalStructure}

      CONTEXT:
      ${JSON.stringify({ generalContext, pageContext }, null, 2)}`;

    // --- Request HF Router ---
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.hfToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: systemContent },
            { role: "user", content: userMessage },
          ],
          max_tokens: 250,
          temperature: 0.7,
        }),
      });

      const data = await response.json();

      return data.choices?.[0]?.message?.content ?? "No response generated.";
    } catch (error) {
      console.error("AIService Error:", error);
      return "The assistant is temporarily unavailable.";
    }
  }

  private async resolveContext(context?: {
    type: "product" | "restaurant" | "static";
    id?: string;
  }) {
    if (!context?.id) return null;

    switch (context.type) {
      case "product":
        return this.aiRepository.getProductContext(context.id);
      case "restaurant":
        return this.aiRepository.getRestaurantContext(context.id);
      case "static":
        return this.aiRepository.getStaticPageContext(context.id);
      default:
        return null;
    }
  }

  private getLanguage(loc: string): string {
    const map: Record<string, string> = {
      ar: "Arabic",
      fr: "French",
      en: "English",
    };
    return map[loc] ?? "English";
  }
}
