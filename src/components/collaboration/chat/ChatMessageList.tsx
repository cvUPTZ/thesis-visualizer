import React from 'react';
import { ChatMessageItem } from './ChatMessageItem';
import { Message } from './types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessageListProps {
  messages: Message[];
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  // Create a reversed copy of messages array to show newest first
  const reversedMessages = [...messages].reverse();
  
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {reversedMessages.map((message) => (
          <ChatMessageItem key={message.id} message={message} />
        ))}
      </div>
    </ScrollArea>
  );
};