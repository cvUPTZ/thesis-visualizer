import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatMessageItemProps {
  message: {
    id: string;
    content: string;
    profiles?: {
      email?: string;
    };
  };
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  return (
    <div key={message.id} className="flex items-start gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage 
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.profiles?.email}`} 
          alt={message.profiles?.email} 
        />
        <AvatarFallback>
          {message.profiles?.email?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">
          {message.profiles?.email}
        </span>
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
};