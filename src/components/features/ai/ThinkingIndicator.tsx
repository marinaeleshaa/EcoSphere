import React from 'react';

export const ThinkingIndicator = () => {
  return (
    <div className="flex space-x-1 items-center p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl rounded-tl-none w-fit border border-gray-100 dark:border-zinc-700/50 shadow-sm animate-fade-in">
      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
    </div>
  );
};
