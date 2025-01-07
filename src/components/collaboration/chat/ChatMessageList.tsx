import React from 'react';
import { ChatMessageItem } from './ChatMessageItem';
import { Message } from './types';

interface ChatMessageListProps {
  messages: Message[];
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  return (
    <div className="space-y-4">
      {[...messages].reverse().map((message) => (
        <ChatMessageItem key={message.id} message={message} />
      ))}
    </div>
  );
};