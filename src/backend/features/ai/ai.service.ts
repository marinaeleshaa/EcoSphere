import { injectable, inject } from "tsyringe";
import { type IAIRepository } from "./ai.repository";
import { types, Message } from "./dto/ai-context.dto";
import { AI_TOOLS } from "./tools";
import { ToolExecutor } from "./tool.executor";

export interface IAIService {
  generateResponse(
    userMessage: string,
    conversationHistory?: Message[], // NEW
    context?: { type: types; id?: string },
    userId?: string, // NEW
    restaurantId?: string // NEW
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
  private readonly model = "Qwen/Qwen2.5-7B-Instruct";
  // The new standard router URL for OpenAI-compatible chat completions
  private readonly apiUrl = "https://router.huggingface.co/v1/chat/completions";

  constructor(
    @inject("AIRepository")
    private readonly aiRepository: IAIRepository,
    @inject("ToolExecutor")
    private readonly toolExecutor: ToolExecutor
  ) {}

  async generateResponse(
    userMessage: string,
    conversationHistory?: Message[],
    context?: { type: types; id?: string },
    userId?: string,
    restaurantId?: string
  ): Promise<string> {
    if (!this.hfToken) {
      console.error("Missing HUGGING_FACE_ACCESS_TOKEN");
      throw new Error("SERVICE_UNAVAILABLE");
    }

    try {
      // --- Get appropriate user context ---
      let userContext;
      if (userId) {
        userContext = await this.aiRepository.getUserContext(userId);
      } else if (restaurantId) {
        userContext = await this.aiRepository.getRestaurantOwnerContext(
          restaurantId
        );
      }

      // --- Prepare context ---
      const generalContext = this.aiRepository.getGeneralContext();
      const pageContext = await this.resolveContext(context);
      const globalStructure = await this.aiRepository.getGlobalStructure();

      // --- Build conversation history context ---
      const historyContext = conversationHistory?.length
        ? `\nRECENT CONVERSATION:\n${conversationHistory
            .map((m) => `${m.role}: ${m.content}`)
            .join("\n")}\n`
        : "";

      const systemContent = `
        You are the EcoSphere Assistant, a helpful AI for a sustainability marketplace.
        Tone: Encouraging, green, emoji-friendly 🌱.
        Constraint: Keep answers concise (under 6 sentences).
        Reply in the same language as the user's message (auto-detect: English, Arabic, or French).

        User Types & Access:
        1. Guest (no auth): Browse products, restaurants, events, recycling
        2. Customer: Guest + orders, points, favorites, cart
        3. Restaurant: Guest + manage products, stats, orders
        4. Organizer: Guest + manage events, attendees
        5. RecycleMan: Guest + manage recycling requests
        6. Admin: Full platform access

        Authentication Rules:
        - If user asks personal questions without auth, politely ask them to log in
        - Guest queries always available
        - Determine user type from context below

        Conversation Context:
        - Use previous messages for context when available
        - If user says "tell me more", reference previous topic
        ${historyContext}

        USER CONTEXT:
        ${
          userContext
            ? JSON.stringify(userContext, null, 2)
            : "No authentication - Guest user"
        }

        Tool Calling Instructions:
        - You have access to functions/tools to query the database
        - Use tools when users ask about products, restaurants, events, recycling, orders, or stats
        - Call the most appropriate tool based on the user's question
        - You can call multiple tools if needed
        - After getting tool results, format them nicely for the user

        Linking Rules:
        • Restaurants → [Name](/shop/ID)
        • Products → [Name](/store/ID)
        • NEVER show raw IDs in visible text.

        GLOBAL SNAPSHOT:
        ${globalStructure}

        PAGE CONTEXT:
        ${JSON.stringify({ generalContext, pageContext }, null, 2)}`;

      // Build messages array
      const messages: any[] = [
        { role: "system", content: systemContent },
        { role: "user", content: userMessage },
      ];

      // Function calling loop (max 3 iterations to prevent infinite loops)
      let maxIterations = 3;
      let finalResponse = "";

      while (maxIterations > 0) {
        const response = await fetch(this.apiUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.hfToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: this.model,
            messages,
            tools: AI_TOOLS, // Provide available tools
            max_tokens: 500,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`HF API Error (${response.status}):`, errorText);

          if (response.status === 429) {
            throw new Error("RATE_LIMIT");
          }
          throw new Error("SERVICE_UNAVAILABLE");
        }

        const data = await response.json();
        const choice = data.choices?.[0];

        if (!choice) {
          throw new Error("No response from LLM");
        }

        const assistantMessage = choice.message;

        // Check if LLM wants to call a tool
        if (
          assistantMessage.tool_calls &&
          assistantMessage.tool_calls.length > 0
        ) {
          // Add assistant message with tool calls to conversation
          messages.push(assistantMessage);

          // Execute each tool call
          for (const toolCall of assistantMessage.tool_calls) {
            const toolName = toolCall.function.name;
            const toolArgs = JSON.parse(toolCall.function.arguments || "{}");

            console.log(`Executing tool: ${toolName}`, toolArgs);

            try {
              // Execute the tool WITH SESSION INFO for CRUD auth
              const toolResult = await this.toolExecutor.executeTool(
                toolName,
                toolArgs,
                {
                  userId,
                  restaurantId,
                  userRole:
                    userId && userContext && "role" in userContext
                      ? userContext.role
                      : undefined,
                }
              );

              // Add tool result to messages
              messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                name: toolName,
                content: JSON.stringify(toolResult),
              });
            } catch (toolError) {
              console.error(`Tool execution error for ${toolName}:`, toolError);
              // Add error message
              messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                name: toolName,
                content: JSON.stringify({ error: "Failed to execute tool" }),
              });
            }
          }

          // Continue loop to get final response with tool results
          maxIterations--;
          continue;
        }

        // No tool calls - we have the final response
        finalResponse = assistantMessage.content || "No response generated.";
        break;
      }

      if (!finalResponse && maxIterations === 0) {
        throw new Error("Max tool calling iterations reached");
      }

      return finalResponse;
    } catch (error: any) {
      console.error("AIService Error:", error);
      // Re-throw specific errors for controller to handle
      if (
        error.message === "RATE_LIMIT" ||
        error.message === "SERVICE_UNAVAILABLE"
      ) {
        throw error;
      }
      throw new Error("SERVICE_UNAVAILABLE");
    }
  }

  private async resolveContext(context?: { type: types; id?: string }) {
    if (!context?.id) return null;

    switch (context.type) {
      case "product":
        return this.aiRepository.getProductContext(context.id);
      case "restaurant":
        return this.aiRepository.getRestaurantContext(context.id);
      case "static":
        return this.aiRepository.getStaticPageContext(context.id);
      case "user": // NEW
        return null; // User context handled separately via userId parameter
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
