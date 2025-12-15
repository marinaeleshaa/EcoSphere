import { injectable, inject } from "tsyringe";
import { type IAIRepository } from "./ai.repository";
import { types } from "./dto/ai-context.dto";

export interface IAIService {
  generateResponse(
    userMessage: string,
    context?: { type: types; id?: string },
    locale?: string
  ): Promise<string>;
  generateSustainabilityScore(
    title: string,
    subtitle: string
  ): Promise<{ score: number; reason: string }>;
  generateZeroWasteRecipe(ingredients: string[]): Promise<any>;
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

  async generateSustainabilityScore(
    title: string,
    subtitle: string
  ): Promise<{ score: number; reason: string }> {
    if (!this.hfToken) {
      return { score: 0, reason: "AI Service Unavailable" };
    }

    const systemPrompt = `
      You are a sustainability expert.
      Analyze this product item and rate its environmental sustainability from 1 to 10.
      
      Rules:
      - Consider carbon footprint, meat vs plant-based (if food), packaging, and general eco-impact.
      - Be strict but fair.
      - Output strictly valid JSON.

      Format:
      {
        "score": number,
        "reason": "short explanation (under 15 words)"
      }
    `;

    const userMessage = `
      Product:
      Title: ${title}
      Subtitle: ${subtitle}
    `;

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
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          max_tokens: 100,
          temperature: 0.3, // Lower temperature for consistent scoring
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) throw new Error("No content received");

      // Parse JSON from MD block if present
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(content);
    } catch (error) {
      console.error("AI Sustainability Score Error:", error);
      return { score: 0, reason: "Analysis Failed" };
    }
  }

  async generateZeroWasteRecipe(ingredients: string[]): Promise<any> {
    if (!this.hfToken) {
      throw new Error("AI Service Unavailable");
    }

    const systemPrompt = `
      You are a professional zero-waste chef and sustainability expert.
      Your goal is to minimize food waste by creating practical, realistic recipes using only the provided ingredients.

      You must:
      - Prefer using ALL ingredients
      - Avoid suggesting rare or expensive additions
      - Scale complexity based on number of ingredients
      - Output ONLY valid JSON matching the provided schema
      - Do not include explanations outside JSON
    `;

    const userMessage = `
      Create a zero-waste recipe using the following leftover ingredients:

      Ingredients:
      ${ingredients.map((ing) => `- ${ing}`).join("\n")}

      Constraints:
      - Assume a home kitchen
      - No food waste
      - Simple but complete meal
      - If ingredients are many, include multi-step cooking techniques

      Return JSON in this EXACT format:
      {
        "recipeName": "",
        "difficulty": "Easy | Medium | Hard",
        "prepTime": "",
        "cookTime": "",
        "steps": [],
        "tips": "",
        "storage": "",
        "sustainabilityNote": ""
      }
    `;

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
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          max_tokens: 600,
          temperature: 0.5,
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) throw new Error("No content received");

      // Parse JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(content);
    } catch (error) {
      console.error("AI Recipe Generation Error:", error);
      throw new Error("Failed to generate recipe");
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
