"use client";

import React, { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackButtonsProps {
  messageId: string;
  userMessage: string;
  aiResponse: string;
  context?: { type: string; id?: string };
}

export const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({
  messageId,
  userMessage,
  aiResponse,
  context,
}) => {
  const [rating, setRating] = useState<"positive" | "negative" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = async (newRating: "positive" | "negative") => {
    if (rating || isSubmitting) return; // Already rated or submitting

    setIsSubmitting(true);
    setRating(newRating);

    try {
      const response = await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          userMessage,
          aiResponse,
          rating: newRating,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      // Silently fail - user already sees their selection
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-buttons">
      <button
        onClick={() => submitFeedback("positive")}
        className={cn(
          "feedback-btn",
          rating === "positive" && "active positive"
        )}
        disabled={rating !== null}
        title="This response was helpful"
        type="button"
      >
        <ThumbsUp size={14} />
      </button>
      <button
        onClick={() => submitFeedback("negative")}
        className={cn(
          "feedback-btn",
          rating === "negative" && "active negative"
        )}
        disabled={rating !== null}
        title="This response needs improvement"
        type="button"
      >
        <ThumbsDown size={14} />
      </button>

      <style jsx>{`
        .feedback-buttons {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .feedback-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s;
          color: #9ca3af;
        }

        .feedback-btn:hover:not(:disabled) {
          background: #f3f4f6;
          border-color: #d1d5db;
          color: #6b7280;
        }

        .feedback-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .feedback-btn.active {
          border-width: 2px;
        }

        .feedback-btn.active.positive {
          background: #d1fae5;
          border-color: #10b981;
          color: #10b981;
        }

        .feedback-btn.active.negative {
          background: #fee2e2;
          border-color: #ef4444;
          color: #ef4444;
        }
      `}</style>
    </div>
  );
};
