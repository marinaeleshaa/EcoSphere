"use client";

import React from "react";
import { ROLE_PROMPTS, PromptSuggestion } from "./promptSuggestions";

interface SuggestedPromptsProps {
  userRole:
    | "guest"
    | "customer"
    | "restaurant"
    | "organizer"
    | "recycleMan"
    | "admin";
  onPromptClick: (prompt: string) => void;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({
  userRole,
  onPromptClick,
}) => {
  const prompts = ROLE_PROMPTS[userRole] || ROLE_PROMPTS.guest;

  return (
    <div className="suggested-prompts">
      <p className="prompt-header">Try asking:</p>
      <div className="prompt-grid">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt.text)}
            className="prompt-button"
            type="button"
          >
            <span className="prompt-icon">{prompt.icon}</span>
            <span className="prompt-text">{prompt.text}</span>
          </button>
        ))}
      </div>

      <style jsx>{`
        .suggested-prompts {
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .prompt-header {
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 0.75rem;
        }

        .prompt-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .prompt-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
          text-align: left;
        }

        .prompt-button:hover {
          background: #f3f4f6;
          border-color: #10b981;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .prompt-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .prompt-text {
          color: #374151;
          line-height: 1.4;
        }

        @media (max-width: 640px) {
          .prompt-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
