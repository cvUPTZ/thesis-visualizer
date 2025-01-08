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

  // Sort messages by created_at in descending order (newest first)
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  return (
    <ScrollArea 
      className="flex-1 p-4 overflow-y-auto" 
      ref={scrollRef}
    >
      <div className="space-y-4 flex flex-col"> {/* Remove reverse direction */}
        {sortedMessages.map((message) => (
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