"use client";

import React from 'react';
import { AIChatButton } from './AIChatButton';
import { AIChatWindow } from './AIChatWindow';
import { useAIChat } from '@/hooks/useAIChat';

export const AIChatWidget = () => {
  const { 
    messages, 
    isLoading, 
    isOpen, 
    toggleOpen, 
    sendMessage, 
    clearChat 
  } = useAIChat();

  return (
    <>
      <AIChatWindow
        isOpen={isOpen}
        onClose={toggleOpen}
        messages={messages}
        onSendMessage={sendMessage}
        isLoading={isLoading}
        onClearChat={clearChat}
      />
      <AIChatButton onClick={toggleOpen} isOpen={isOpen} />
    </>
  );
};
