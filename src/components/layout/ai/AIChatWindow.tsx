"use client";

import React, { useRef, useEffect, useState } from "react";
import { Send, X, Eraser, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "./ChatMessage";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { useTranslations, useLocale } from "next-intl";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onClearChat: () => void;
}

export const AIChatWindow: React.FC<AIChatWindowProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  isLoading,
  onClearChat,
}) => {
  const t = useTranslations("AI.window");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed bottom-24 w-[90vw] md:w-[400px] h-[600px] max-h-[75vh] bg-card text-card-foreground",
        isRTL ? "left-6" : "right-6",
        "rounded-3xl shadow-2xl border border-border flex flex-col overflow-hidden z-60",
        "animate-in slide-in-from-bottom-10 fade-in duration-300"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-primary text-primary-foreground shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full backdrop-blur-md">
            <Sparkles size={18} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">{t("title")}</h3>
            <p className="text-xs opacity-90 font-medium">{t("subtitle")}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onClearChat}
            className="p-2 hover:bg-white/10 rounded-full transition-colors opacity-90 hover:opacity-100"
            title={t("clearChat")}
          >
            <Eraser size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors opacity-90 hover:opacity-100"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-muted/30 scrollbar-thin scrollbar-thumb-muted-foreground/20">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
              <Sparkles size={32} />
            </div>
            <p className="font-medium text-foreground">
              {t("emptyState.title")}
            </p>
            <p className="text-sm mt-2 opacity-75">
              {t("emptyState.subtitle")}
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <ChatMessage key={idx} role={msg.role} content={msg.content} />
        ))}

        {isLoading && <ThinkingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border shrink-0">
        <div className="relative flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("input.placeholder")}
            className="flex-1 myInput resize-none max-h-32 min-h-12"
            rows={1}
            style={{ minHeight: "48px" }}
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isLoading}
            className={cn(
              "p-3 rounded-full mb-1 transition-all duration-300",
              input.trim() && !isLoading
                ? "bg-primary text-primary-foreground shadow-md hover:scale-105 active:scale-95"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <Send
              size={18}
              className={input.trim() && !isLoading ? "ml-0.5" : ""}
            />
          </button>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-2">
          {t("disclaimer")}
        </p>
      </div>
    </div>
  );
};
