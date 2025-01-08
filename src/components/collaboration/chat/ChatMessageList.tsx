import React, { useEffect, useRef } from 'react';
import { ChatMessageItem } from './ChatMessageItem';
import { Message } from './types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessageListProps {
  messages: Message[];
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea 
      className="flex-1 p-4 overflow-y-auto" 
      ref={scrollRef}
    >
      <div className="space-y-4">
        {messages.map((message) => (
          <ChatMessageItem 
            key={message.id} 
            message={message} 
            isCurrentUser={message.sender_id === currentUserId}
          />
        ))}
      </div>
    </ScrollArea>
  );
};