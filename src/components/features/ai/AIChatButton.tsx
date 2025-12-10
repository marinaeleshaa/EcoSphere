"use client";

import React from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

import { useTranslations } from 'next-intl';

export const AIChatButton: React.FC<AIChatButtonProps> = ({ onClick, isOpen }) => {
  const t = useTranslations('AI.button');
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-[50] group",
        "flex items-center justify-center p-4 rounded-full shadow-lg hover:shadow-primary/25 transition-all duration-300",
        "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95",
        isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
      )}
      aria-label={t('label')}
    >
      {/* Glow Effect */}
      <span className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="relative flex items-center gap-2">
         <Sparkles size={24} className="animate-pulse" />
         <span className="font-semibold hidden group-hover:block animate-in slide-in-from-right-2 fade-in duration-300 whitespace-nowrap pr-1">
             {t('label')}
         </span>
      </div>
    </button>
  );
};
