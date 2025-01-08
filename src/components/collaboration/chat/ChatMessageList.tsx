import React from 'react';
import { Message } from './types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessageListProps {
  messages: Message[];
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages?.map((message) => (
          <div key={message.id} className="flex flex-col">
            <span className="text-sm text-muted-foreground">{message.sender?.email}</span>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};