import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from './types';
import { ChatMessageItem } from './ChatMessageItem';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessageListProps {
  messages: Message[];
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  const { user } = useAuth();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-background/50 to-background">
      <div className="space-y-4" ref={scrollRef}>
        {messages?.map((message) => (
          <ChatMessageItem 
            key={message.id} 
            message={message} 
            isCurrentUser={message.sender_id === user?.id}
          />
        ))}
        {messages?.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No messages yet
          </div>
        )}
      </div>
    </ScrollArea>
  );
};