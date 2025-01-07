import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ChatMessageItemProps {
  message: {
    id: string;
    content: string;
    sender_id: string;
    profiles?: {
      email?: string;
    };
  };
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <Avatar className="h-8 w-8 shrink-0 bg-primary/10">
        <AvatarImage 
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.profiles?.email}`} 
          alt={message.profiles?.email} 
        />
        <AvatarFallback className="bg-primary/5 text-primary">
          {message.profiles?.email?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-muted-foreground">
          {message.profiles?.email}
        </span>
        <p className="text-sm leading-relaxed break-words">{message.content}</p>
      </div>
    </div>
  );
};