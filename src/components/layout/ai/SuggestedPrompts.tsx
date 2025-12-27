"use client";

import React from "react";
import { ROLE_PROMPTS, PromptCategory } from "./promptSuggestions";

interface SuggestedPromptsProps {
  userRole:
    | "guest"
    | "customer"
    | "restaurant"
    | "organizer"
    | "recycleAgent"
    | "admin";
  onPromptClick: (prompt: string) => void;
  disabled?: boolean;
  showHeader?: boolean;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({
  userRole,
  onPromptClick,
  disabled = false,
  showHeader = true,
}) => {
  const categories = ROLE_PROMPTS[userRole] || ROLE_PROMPTS.guest;

  return (
    <div className="suggested-prompts">
      {showHeader && <p className="prompt-header">Try asking:</p>}

      <div className="categories-container">
        {categories.map((category, catIdx) => (
          <div key={catIdx} className="prompt-category">
            <h4 className="category-title">{category.title}</h4>
            <div className="prompt-grid">
              {category.prompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => onPromptClick(prompt.text)}
                  className="prompt-button"
                  type="button"
                  disabled={disabled}
                >
                  <span className="prompt-icon">{prompt.icon}</span>
                  <span className="prompt-text">{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .suggested-prompts {
          padding: 0.5rem;
        }

        .prompt-header {
          font-size: 0.75rem;
          font-weight: 700;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
          padding-left: 0.5rem;
        }

        .categories-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .prompt-category {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .category-title {
          font-size: 0.7rem;
          font-weight: 600;
          color: #111827;
          opacity: 0.8;
          padding-left: 0.5rem;
        }

        .prompt-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.4rem;
        }

        .prompt-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 0.75rem;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.8rem;
          text-align: left;
          height: 100%;
        }

        .prompt-button:hover:not(:disabled) {
          background: #f0fdf4;
          border-color: #10b981;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.1);
        }

        .prompt-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .prompt-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          filter: grayscale(1);
        }

        .prompt-icon {
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .prompt-text {
          color: #374151;
          line-height: 1.2;
          font-weight: 500;
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
