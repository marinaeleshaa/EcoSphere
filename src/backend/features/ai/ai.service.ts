import { injectable, inject } from "tsyringe";
import { type IAIRepository } from "./ai.repository";

export interface IAIService {
  generateResponse(
    userMessage: string,
    context?: { type: "product" | "restaurant" | "static"; id?: string }
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

    // 1. Fetch Context Data
    const generalContext = this.aiRepository.getGeneralContext();
    let contextData = { ...generalContext, pageContext: null as any };

    if (context) {
      if (context.type === "product" && context.id) {
        const productInfo = await this.aiRepository.getProductContext(
          context.id
        );
        if (productInfo) {
          contextData.pageContext = { type: "product", data: productInfo };
        }
      } else if (context.type === "restaurant" && context.id) {
        const restaurantInfo = await this.aiRepository.getRestaurantContext(
          context.id
        );
        if (restaurantInfo) {
          contextData.pageContext = {
            type: "restaurant",
            data: restaurantInfo,
          };
        }
      } else if (context.type === "static" && context.id) {
        const pageInfo = this.aiRepository.getStaticPageContext(context.id);
        contextData.pageContext = { type: "static", info: pageInfo };
      }
    }

    const globalStructure = await this.aiRepository.getGlobalStructure();

    // 2. Construct System Message
    const systemContent = `
      You are the EcoSphere Assistant, a helpful AI for a sustainability marketplace.
      Tone: Encouraging, green, and emoji-friendly 🌱.
      Constraint: Keep answers concise (under 3 sentences).
      Constraint: Keep answers concise (under 3 sentences).
      Linking Rules:
      1. When mentioning a restaurant, use this format: [Restaurant Name](/shop/ID).
      2. When mentioning a product, use this format: [Product Name](/store/ID).
      3. CRITICAL: NEVER show the ID in the visible text.
         - BAD: "GreenBites (ID: 123)"
         - GOOD: "[GreenBites](/shop/123)"
      Language: Reply in ${
        locale === "ar" ? "Arabic" : locale === "fr" ? "French" : "English"
      }.
      Knowledge Base: Use the provided JSON context to answer questions.
      
      ${globalStructure}

      CONTEXT DATA (JSON):
      ${JSON.stringify(contextData, null, 2)}
    `;

    // 3. Call Hugging Face API (OpenAI Compatible)
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

      if (!response.ok) {
        const errText = await response.text();
        console.error("Hugging Face API Error:", errText);

        if (response.status === 503) {
          return "I am warming up. Please try again in 10 seconds.";
        }
        throw new Error(
          `HF API Error: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      return (
        result.choices?.[0]?.message?.content ||
        "I'm sorry, I couldn't generate a response."
      );
    } catch (error: any) {
      console.error("AI Service Error:", error);
      throw new Error("Failed to communicate with AI service");
    }
  }
}
