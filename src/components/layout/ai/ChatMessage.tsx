"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { FeedbackButtons } from "./FeedbackButtons";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  userMessage?: string; // Previous user message for feedback context
  context?: { type: string; id?: string };
  index?: number; // For generating unique message IDs
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  userMessage = "",
  context,
  index = 0,
}) => {
  const isUser = role === "user";

  // Generate unique message ID for feedback
  const messageId = `msg-${Date.now()}-${index}`;

  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[85%] md:max-w-[75%] gap-2",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-card text-primary border border-border"
          )}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Message Bubble */}
        <div className="flex flex-col gap-1">
          <div
            className={cn(
              "p-3.5 px-5 rounded-2xl shadow-sm leading-relaxed text-sm md:text-base",
              isUser
                ? "bg-primary text-primary-foreground rounded-tr-none selection:bg-white/30"
                : "bg-card text-card-foreground border border-border rounded-tl-none selection:bg-primary/20"
            )}
          >
            {/* Render Markdown cleanly */}
            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-pre:bg-muted prose-pre:p-2 prose-pre:rounded-lg">
              <ReactMarkdown
                components={{
                  a: ({ ...props }) => (
                    <a
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-500 transition-colors"
                    />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Feedback Buttons (only for assistant messages) */}
          {!isUser && userMessage && (
            <FeedbackButtons
              messageId={messageId}
              userMessage={userMessage}
              aiResponse={content}
              context={context}
            />
          )}
        </div>
      </div>
    </div>
  );
};
