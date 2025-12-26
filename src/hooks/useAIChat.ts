import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const useAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("AI.errors");
  // REMOVED: const locale = useLocale(); - AI now auto-detects language!

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const clearChat = () => setMessages([]);

  const determineContext = (path: string) => {
    // 1. Dynamic Routes (IDs)
    if (path.includes("/products/")) {
      const id = path.split("/").pop();
      return { type: "product", id };
    }
    if (path.includes("/restaurants/")) {
      const id = path.split("/").pop();
      return { type: "restaurant", id };
    }

    // 2. Static Routes (Page Names)
    if (path.includes("/shop")) return { type: "static", id: "shop" }; // List of shops
    if (path.includes("/store")) return { type: "static", id: "store" }; // List of products
    if (path.includes("/recycle")) return { type: "static", id: "recycle" };
    if (path.includes("/events")) return { type: "static", id: "events" };
    if (path.includes("/about")) return { type: "static", id: "about" };
    if (path.includes("/auth")) return { type: "static", id: "auth" };
    if (path.includes("/profile")) return { type: "static", id: "profile" };
    if (path.includes("/cart")) return { type: "static", id: "cart" };
    if (path.includes("/fav")) return { type: "static", id: "favorites" };
    if (path.includes("/game")) return { type: "static", id: "game" };
    if (path.includes("/news")) return { type: "static", id: "news" };
    if (path.includes("/dashboard")) return { type: "static", id: "dashboard" };
    if (path.includes("/subscription"))
      return { type: "static", id: "subscription" };

    // Default to Home if root or unhandled
    return { type: "static", id: "home" };
  };

  const sendMessage = async (content: string) => {
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const context = determineContext(pathname || "");

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversationHistory: messages, // NEW: Send conversation history
          context: context,
          // REMOVED: locale - AI auto-detects language now
        }),
      });

      // Enhanced error handling
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("RATE_LIMIT");
        }
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();
      const aiMessage: Message = { role: "assistant", content: data.answer };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Chat error:", error);

      // Specific error messages
      let errorMessage = t("connection");
      if (error.message === "RATE_LIMIT") {
        errorMessage = "Too many requests. Please wait a moment and try again.";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    isOpen,
    toggleOpen,
    sendMessage,
    clearChat,
  };
};
