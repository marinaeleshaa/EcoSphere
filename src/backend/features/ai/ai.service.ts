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
        5. recycleAgent: Guest + manage recycling requests
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

      // --- NEW: Fast Path for Predefined Prompts (Bypass LLM) ---
      const fastPathResult = await this.tryFastPath(
        userMessage,
        userId,
        restaurantId,
        userContext
      );
      if (fastPathResult) {
        return fastPathResult;
      }

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

  private async tryFastPath(
    message: string,
    userId?: string,
    restaurantId?: string,
    userContext?: any
  ): Promise<string | null> {
    const session = {
      userId,
      restaurantId,
      userRole: userContext?.role,
    };

    const mapping: Record<string, { name: string; args: any }> = {
      "Show me eco-friendly products": {
        name: "getMostSustainableProducts",
        args: { limit: 5 },
      },
      "Find restaurants near me": {
        name: "getTopRestaurantsByRating",
        args: { limit: 5 },
      },
      "What are the top-rated products?": {
        name: "getTopProductsByRating",
        args: { limit: 5 },
      },
      "Show me the cheapest products": {
        name: "getCheapestProducts",
        args: { limit: 5 },
      },
      "Show the points leaderboard": {
        name: "getTopUsersByPoints",
        args: { limit: 10 },
      },
      "What's in my cart?": { name: "viewMyCart", args: {} },
      "View my favorites": { name: "viewMyFavorites", args: {} },
      "Show my orders": { name: "getRecentOrders", args: { limit: 5 } },
      "How many points do I have?": { name: "getMyPoints", args: {} },
      "List my products": {
        name: "getRestaurantsByCategory",
        args: { category: "all" },
      },
      "Show my pending orders": {
        name: "getOrdersByStatus",
        args: { status: "pending", limit: 5 },
      },
      "Show completed orders": {
        name: "getOrdersByStatus",
        args: { status: "completed", limit: 5 },
      },
      "Explain sustainability scores": {
        name: "getGeneralInfo",
        args: { topic: "sustainability" },
      },
      "How does recycling work?": {
        name: "getGeneralInfo",
        args: { topic: "recycling" },
      },
      "Go to my profile": { name: "navigation", args: { path: "/profile" } },
      "Clear my cart": { name: "clearCart", args: {} },
      "Most sustainable products available": {
        name: "getMostSustainableProducts",
        args: { limit: 5 },
      },
      "Show my sales statistics": { name: "getRestaurantStats", args: {} },
      "What's my revenue?": { name: "getRestaurantRevenue", args: {} },
      "Top-selling products": {
        name: "getTopSellingProducts",
        args: { limit: 5 },
      },
      "Show my events": { name: "getUpcomingEvents", args: { limit: 10 } },
      "Upcoming events": { name: "getUpcomingEvents", args: { limit: 5 } },
      "How many attendees?": { name: "getEventStatistics", args: {} },
      "Pending recycling requests": {
        name: "getPendingRecyclingRequests",
        args: { limit: 10 },
      },
      "Show today's pickups": {
        name: "getRecentRecyclingEntries",
        args: { limit: 5 },
      },
      "Carbon saved this month": { name: "getRecyclingStatistics", args: {} },
      "Recycling locations": { name: "getRecyclingLocations", args: {} },
      "Platform statistics": {
        name: "getGeneralInfo",
        args: { topic: "stats" },
      },
      "Total revenue": { name: "getTotalRevenue", args: {} },
      "User growth metrics": { name: "getRecentUserCount", args: { days: 30 } },
      "Total carbon impact": { name: "getTotalCarbonSaved", args: {} },
    };

    const match = mapping[message];
    if (!match) return null;

    try {
      if (match.name === "navigation") {
        return `Sure! You can access your profile [here](${match.args.path}). 👤`;
      }
      if (match.name === "getGeneralInfo") {
        if (match.args.topic === "sustainability") {
          return "Our Sustainability Score is calculated based on eco-friendly packaging, carbon offset, and waste reduction efforts. Products ranked 80+ are certified Gold! 🌟";
        }
        if (match.args.topic === "recycling") {
          return "To recycle, simply go to the Recycle section, select your items (plastic, paper, glass), and a driver will collect them. You earn points for every kg! ♻️";
        }
        if (match.args.topic === "stats") {
          return "EcoSphere is currently powering over 50 local shops and has saved over 5,000kg of CO2 this year! 🌍";
        }
        return "I can help with that! What specific info are you looking for? 🌱";
      }
      if (match.name === "getRecyclingLocations") {
        return "You can find our recycling partner hubs in the 'Explore' section of the map. Look for the green icons! 📍";
      }
      console.log(`[FastPath] Executing ${match.name} for: ${message}`);
      const result = await this.toolExecutor.executeTool(
        match.name,
        match.args,
        session
      );
      return this.formatDirectResponse(match.name, result);
    } catch (e) {
      console.error("[FastPath] Error:", e);
      return null; // Fallback to AI if fast path fails (e.g. tool not found or auth error)
    }
  }

  private formatDirectResponse(toolName: string, data: any): string {
    if (!data) return "I couldn't find any information on that. 🌱";

    switch (toolName) {
      case "viewMyCart": {
        if (!data || !data.length) return "Your cart is currently empty. 🛒";
        const total = data.reduce((sum: number, item: any) => {
          const price = Number(item.productPrice) || 0;
          const quantity = Number(item.quantity) || 1;
          return sum + price * quantity;
        }, 0);
        const items = data
          .map((item: any) => {
            const price = Number(item.productPrice) || 0;
            const quantity = Number(item.quantity) || 1;
            return `• ${item.productTitle} x${quantity} (${price.toFixed(
              2
            )} EGP)`;
          })
          .join("\n");
        return `Here is your current cart:\n${items}\n\n**Total: ${total.toFixed(
          2
        )} EGP** 🛍️`;
      }

      case "viewMyFavorites": {
        if (!data || !data.length)
          return "You haven't added any favorites yet. ⭐";
        const favs = data
          .map((item: any) => `• [${item.title}](/store/${item._id})`)
          .join("\n");
        return `Your Favorite Items:\n${favs}\n\nFind more eco-friendly items in our store!`;
      }
      case "getMyPoints":
        return `You currently have **${
          data.points || 0
        } Eco-Points**! 🎯 Keep being sustainable to earn more.`;
      case "getMostSustainableProducts":
      case "getTopProductsByRating":
      case "getCheapestProducts": {
        if (!data.length) return "No products found matches your request. 🛍️";
        const products = data
          .map(
            (p: any) =>
              `• [${p.title}](/store/${p._id}) - ${p.price} EGP (Score: ${
                p.sustainabilityScore || "N/A"
              })`
          )
          .join("\n");
        return `I found these products for you:\n${products}`;
      }
      case "getTopRestaurantsByRating": {
        if (!data.length) return "No restaurants found. 🍽️";
        const shops = data
          .map(
            (s: any) =>
              `• [${s.name}](/shop/${s._id}) - Rating: ${
                s.restaurantRatingAvg || "5.0"
              }`
          )
          .join("\n");
        return `Here are some highly rated shops:\n${shops}`;
      }
      case "getRecentOrders": {
        if (!data.length) return "You don't have any recent orders. 📦";
        const orders = data
          .map(
            (o: any) =>
              `• Order #${o._id.toString().slice(-6)} - Status: ${o.status}`
          )
          .join("\n");
        return `Your recent orders:\n${orders}`;
      }
      case "getTopUsersByPoints": {
        if (!data || !data.length) return "No leaderboard data available yet.";
        const winners = data
          .map((u: any, i: number) => {
            const name =
              u.fullName ||
              `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
              u.username ||
              "Eco-Hero";
            return `${i + 1}. ${name} - **${u.points} pts**`;
          })
          .join("\n");
        return `🏆 **EcoSphere Leaderboard** 🏆\n\n${winners}`;
      }
      case "getOrdersByStatus": {
        if (!data || !data.length) return "No orders found for this status. ✅";
        const count = data.length;
        const details = data
          .slice(0, 5)
          .map((o: any) => `• Order #${o._id.toString().slice(-6)}`)
          .join("\n");
        return `You have ${count} orders in this status.\n${details}`;
      }
      case "getEventStatistics":
        return `📊 **Platform Event Summary**:\n• Total Events: ${
          data.totalEvents || 0
        }\n• Active/Upcoming: ${
          data.upcomingEvents || 0
        }\n• Community Attendees: ${data.totalAttendees || 0} 👥`;
      case "getRecentRecyclingEntries": {
        if (!data || !data.length)
          return "No recycling entries found today. ♻️";
        const entries = data
          .map(
            (e: any) =>
              `• ${e.firstName || "User"} saved **${
                e.totalCarbonSaved || 0
              }kg** CO2`
          )
          .join("\n");
        return `Today's Recycling Impact:\n${entries}\n\nKeep up the great work! 🌍`;
      }
      case "getRecentUserCount":
        return `📈 **User Growth**: We've welcomed **${
          data || 0
        } new members** to the EcoSphere community in the last 30 days! 🚀`;
      case "getRestaurantStats":
      case "getRestaurantRevenue":
        return `💰 **Business Performance**:\nYour total platform revenue is **${
          data.totalRevenue || data || 0
        } EGP**. Use the dashboard for detailed breakdowns.`;
      case "getUpcomingEvents": {
        if (!data.length)
          return "There are no upcoming events at the moment. 📅";
        const events = data
          .map(
            (e: any) =>
              `• [${e.name}](/events/${e._id}) - ${new Date(
                e.eventDate
              ).toLocaleDateString()}`
          )
          .join("\n");
        return `Upcoming Eco-Events:\n${events}`;
      }
      case "getPendingRecyclingRequests": {
        if (!data.length) return "No pending recycling requests found. ♻️";
        const reqs = data
          .map(
            (r: any) =>
              `• Request #${r._id.toString().slice(-6)} - User: ${
                r.fullname || "Anonymous"
              }`
          )
          .join("\n");
        return `Pending Recycling Requests:\n${reqs}`;
      }
      case "getTotalCarbonSaved":
        return `Together, we have saved **${
          data.totalCarbonSaved || data
        } kg** of CO2! 🌍`;
      case "getRecyclingStatistics":
        return `Recycling Impact:\n• Total Pickups: ${
          data.totalPickups || 0
        }\n• Total Carbon Saved: ${data.totalCarbonSaved || 0}kg`;
      case "getTotalRevenue":
        return `Total Platform Revenue: **${data.totalRevenue || 0} EGP**. 💰`;
      case "getTopSellingProducts": {
        if (!data || !data.length)
          return "No sales data found for products yet. 📈";
        const top = data
          .slice(0, 5)
          .map(
            (p: any) =>
              `• [${p.title}](/store/${p._id}) - ${p.totalSales || 0} sold`
          )
          .join("\n");
        return `Top Selling Products:\n${top}`;
      }
      case "clearCart":
        return "Your cart has been cleared successfully. 🧹";
      default:
        console.log(
          `[Formatter] No specific case for ${toolName}, using generic:`,
          data
        );
        if (typeof data === "string") return data;
        return "I've updated the information for you! Is there anything else you need? 🌱";
    }
  }
}
