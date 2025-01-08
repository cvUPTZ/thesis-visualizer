import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface ChatMessageItemProps {
  message: {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
    profiles?: {
      email?: string;
    };
  };
  isCurrentUser?: boolean;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, isCurrentUser }) => {
  return (
    <div className={cn(
      "flex items-start gap-3 group transition-all duration-200 hover:bg-primary/5 p-2 rounded-lg",
      isCurrentUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="h-8 w-8 shrink-0 animate-fade-in">
        <AvatarImage 
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.profiles?.email}`} 
          alt={message.profiles?.email} 
        />
        <AvatarFallback className="bg-primary/5 text-primary">
          {message.profiles?.email?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "flex flex-col max-w-[80%]",
        isCurrentUser ? "items-end" : "items-start"
      )}>
        <span className="text-xs font-medium text-muted-foreground mb-1">
          {message.profiles?.email}
          <span className="mx-2 text-muted-foreground/60">•</span>
          <span className="text-xs text-muted-foreground/60">
            {format(new Date(message.created_at), 'HH:mm')}
          </span>
        </span>
        
        <div className={cn(
          "flex items-center gap-2",
          isCurrentUser ? "flex-row-reverse" : "flex-row"
        )}>
          {!isCurrentUser && <ChevronRight className="h-4 w-4 text-muted-foreground/40" />}
          <div className={cn(
            "rounded-2xl px-4 py-2 break-words animate-slide-up backdrop-blur-sm",
            isCurrentUser 
              ? "bg-primary text-primary-foreground rounded-tr-none bg-gradient-to-r from-primary to-primary/90" 
              : "bg-muted rounded-tl-none bg-gradient-to-r from-muted to-muted/80"
          )}>
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          {isCurrentUser && <ChevronLeft className="h-4 w-4 text-muted-foreground/40" />}
        </div>
      </div>
    </div>
  );
};